const { sendJSONresponse } = require('../utils')
const {
    CollateralLock, Endpoint, ProtocolContract, sequelize,
    CollateralEvent, LoanEvent, Loan, Matching, AutoLender,
    SystemSettings
} = require('../models/sequelize')
const rp = require('request-promise')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const { ABI } = require('../config/ABI')
const Tx = require('ethereumjs-tx').Transaction
const { getTxReceipt, getCurrentBlockNumber } = require('../utils/harmony')
const { Harmony } = require('@harmony-js/core')
const { ChainType, ChainID } = require('@harmony-js/utils')
const emailNotification = require('./emailNotification')

module.exports.sendPendingTxs = async (req, res) => {

    const pendingTxs = await Matching.findAll({
        where: {
            transactionSent: 0
        },
    })

    if (!pendingTxs) {
        sendJSONresponse(res, 200, { status: 'OK', message: 'No pending txs to match' })
        return
    }

    const systemSettings = await SystemSettings.findOne({
        where: {
            id: 1,
        }
    })

    if (!systemSettings || systemSettings.matchingEngineActive === 1) {
        sendJSONresponse(res, 200, { status: 'ERROR', message: 'Matching Engine is already active' })
        return
    }

    systemSettings.matchingEngineActive = 1
    await systemSettings.save()

    for (let pendingTx of pendingTxs) {
        const endpoint = await Endpoint.findOne({
            where: {
                endpointType: 'HTTP',
                blockchain: pendingTx.loansBlockchain,
                network: pendingTx.network,
            },
        })

        if (!endpoint) {
            console.log('Endpoint not found')
            continue
        }

        const autoLender = await AutoLender.findOne({
            where: {
                blockchain: pendingTx.loansBlockchain
            }
        })

        if (!autoLender) {
            console.log('Autolender not found')
            continue
        }

        const aCoinEndpoint = await Endpoint.findOne({
            where: {
                endpointType: 'HTTP',
                blockchain: pendingTx.collateralLockBlockchain,
                network: pendingTx.network
            }
        })

        if (!aCoinEndpoint) {
            console.log('Acoin endpoint not found')
            continue
        }

        let receipt, currentBlockNumber, confirmations, collateralValue
        // Check Collateral Confirmations
        if (pendingTx.collateralLockBlockchain === 'ONE') {
            receipt = await getTxReceipt({ endpoint: aCoinEndpoint.endpoint, txHash: pendingTx.collateralLockTxHash })
            currentBlockNumber = (await getCurrentBlockNumber({ endpoint: aCoinEndpoint.endpoint })).result
            confirmations = parseInt(currentBlockNumber) - parseInt(receipt.result.blockNumber)

            // Fetch CollateralValue
            const hmy = new Harmony(aCoinEndpoint.endpoint, { chainType: ChainType.Harmony, chainId: pendingTx.network === 'mainnet' ? ChainID.HmyMainnet : ChainID.HmyTestnet })
            const collateralLock = hmy.contracts.createContract(ABI.CollateralLockV2.abi, pendingTx.collateralLockContract)
            const lock = await collateralLock.methods.fetchLoan(pendingTx.aCoinLoanId).call()
            collateralValue = new BigNumber(lock.details[1]).dividedBy(1e18)
        }

        // Chack confirmations
        if (confirmations < 4) {
            console.log('Waiting for confirmations')
            continue
        }

        // AssignBorrowerAndApprove
        if (pendingTx.loansBlockchain === 'ETH') {
            try {
                const web3 = new Web3(new Web3.providers.HttpProvider(endpoint.endpoint))
                const contract = new web3.eth.Contract(ABI.CrosschainLoans.abi, pendingTx.loansContract)

                // Check Collateral Amount                
                let loan = await contract.methods.fetchLoan(pendingTx.bCoinLoanId).call()
                const principal = BigNumber(loan.details[0]).dividedBy(1e18)

                if (collateralValue.lt(principal)) {
                    const diff = principal.minus(collateralValue)
                    const percentageDiff = diff.dividedBy(principal).multipliedBy(100)

                    if (percentageDiff.gt(10)) {
                        console.log('Insufficient collateral')
                        pendingTx.matchingCompleted = -1
                        pendingTx.transactionSent = -1
                        await pendingTx.save()
                        continue
                    }
                }

                // Get Nonce
                const nonce = await web3.eth.getTransactionCount(autoLender.publicKey)

                // Encode TxData
                const txData = await contract.methods.setBorrowerAndApprove(
                    pendingTx.bCoinLoanId,
                    pendingTx.bCoinBorrowerAddress,
                    pendingTx.secretHashA1
                ).encodeABI()

                // Encode Gas
                let gasPrice = parseInt(await web3.eth.getGasPrice()) > 80000000000 ? parseInt(await web3.eth.getGasPrice()) : 80000000000
                gasPrice = web3.utils.toHex(parseInt(gasPrice * 1.25))
                let gasLimit = web3.utils.toHex('250000')

                // Prepare Tx
                const rawTx = {
                    from: autoLender.publicKey,
                    nonce: '0x' + nonce.toString(16),
                    gasLimit,
                    gasPrice,
                    to: pendingTx.loansContract,
                    value: '0x0',
                    chainId: pendingTx.network === 'mainnet' ? 1 : 3,
                    data: txData
                }

                // Create TX
                const tx = new Tx(rawTx, { chain: pendingTx.network === 'mainnet' ? 'mainnet' : 'ropsten' })

                // Load Private Key
                const privateKey = new Buffer.from((autoLender.privateKey).replace('0x', ''), 'hex')

                // Sign Tx
                tx.sign(privateKey)

                // Serialize Tx
                const serializedTx = tx.serialize()

                // Send Tx
                pendingTx.transactionSent = 1
                await pendingTx.save()
                const response = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                console.log('TxHash: ', response.transactionHash)

                // Save TxHash and Update Pending Matching                
                pendingTx.assignBorrowerTxHash = response.transactionHash
                await pendingTx.save()

                // Update Loan Details
                loan = await contract.methods.fetchLoan(pendingTx.bCoinLoanId).call()
                const dbLoan = await Loan.findOne({
                    where: {
                        contractLoanId: pendingTx.bCoinLoanId
                    }
                })

                // Update Loan Details
                dbLoan.status = loan.state
                dbLoan.borrower = loan.actors[0]
                dbLoan.secretHashA1 = loan.secretHashes[0]
                dbLoan.loanExpiration = loan.expirations[0]
                dbLoan.acceptExpiration = loan.expirations[1]
                await dbLoan.save()

                // Save Loan Event
                await LoanEvent.findOrCreate({
                    where: {
                        txHash: response.transactionHash
                    },
                    defaults: {
                        txHash: response.transactionHash,
                        event: 'LoanAssignedAndApproved',
                        loanId: pendingTx.bCoinLoanId,
                        blockchain: pendingTx.loansBlockchain,
                        network: pendingTx.network,
                        contractAddress: pendingTx.loansContract
                    },
                })

                pendingTx.matchingCompleted = 1
                await pendingTx.save()

                // Send Email Notification
                try {
                    emailNotification.sendLoanApproved(dbLoan.id)
                        .then(res => console.log(res))
                } catch (e) {
                    console.error(e)
                }

            } catch (e) {
                console.log(e)
                pendingTx.transactionSent = 0
                await pendingTx
                continue
            }
        }
    }

    systemSettings.matchingEngineActive = 0
    await systemSettings.save()
    sendJSONresponse(res, 200, { status: 'OK', message: 'Transactions Matched' })
    return
}