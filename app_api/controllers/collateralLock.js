const { sendJSONresponse } = require('../utils')
const {
    CollateralLock, Endpoint, ProtocolContract, sequelize,
    CollateralEvent, LoanEvent, Loan, Matching
} = require('../models/sequelize')
const { Harmony } = require('@harmony-js/core')
const { ChainType, ChainID } = require('@harmony-js/utils')
const rp = require('request-promise')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const { ABI } = require('../config/ABI')
const { getTxReceipt } = require('../utils/harmony')
const emailNotification = require('./emailNotification')

module.exports.confirmCollateralLockOperation_ONE = async (req, res) => {

    let { blockchain, network, operation, txHash } = req.body

    if (!blockchain || !network || !operation || !txHash) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required arguments' })
        return
    }

    if (!(operation === 'LockCollateral' || operation === 'UnlockAndClose' || operation === 'SeizeCollateral')) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Invalid Lock Collateral Operation' })
        return
    }



    const dbCollateralEvent = await LoanEvent.findOne({
        where: {
            txHash,
        },

    })

    if (dbCollateralEvent) {
        sendJSONresponse(res, 200, { status: 'OK', message: 'Collateral Lock Event already saved' })
        return
    }

    const endpoint = await Endpoint.findOne({
        where: {
            endpointType: 'HTTP',
            blockchain,
            network,
        },

    })

    if (!endpoint) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Endpoint not found' })
        return
    }

    const protocolContract = await ProtocolContract.findOne({
        where: {
            name: 'CollateralLockV2_' + blockchain,
            blockchain,
            network
        },

    })

    if (!protocolContract) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Protocol Contract not found' })
        return
    }

    const web3 = new Web3()
    let receipt, contract

    if (blockchain === 'ONE') {
        receipt = await getTxReceipt({ endpoint: endpoint.endpoint, txHash })
        const hmy = new Harmony(endpoint.endpoint, { chainType: ChainType.Harmony, chainId: network === 'mainnet' ? ChainID.HmyMainnet : ChainID.HmyTestnet })
        contract = hmy.contracts.createContract(ABI.CollateralLockV2.abi, protocolContract.address)
    }

    // Check Tx Status
    if (receipt.result.status != 1) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Invalid transaction hash' })
        return
    }

    const eventInputs = ABI.CollateralLockV2.abi.filter((e) => e.name === operation)
    const data = receipt.result.logs[0].data
    const topics = receipt.result.logs[0].topics
    const logs = await web3.eth.abi.decodeLog(eventInputs[0].inputs, data, topics)

    // Save Loan Event
    const [loanEvent, loanEventCreated] = await LoanEvent.findOrCreate({
        where: {
            txHash
        },
        defaults: {
            txHash,
            event: operation,
            loanId: logs.loanId,
            blockchain,
            network,
            contractAddress: protocolContract.address
        },

    })

    if (!loanEventCreated) {
        sendJSONresponse(res, 200, { status: 'OK', message: 'Loan Event already saved' })
        return
    }

    // Fetch CollateralLock Details
    const lock = await contract.methods.fetchLoan(logs.loanId).call()

    // Save CollateralLock/Loan Details
    const [dbCollateralLock, created] = await CollateralLock.findOrCreate({
        where: {
            contractLoanId: logs.loanId,
            blockchain,
        },
        defaults: {
            contractLoanId: logs.loanId,
            bCoinContractLoanId: lock.bCoinLoanId,
            borrower: lock.actors[0],
            lender: lock.actors[1],
            bCoinBorrowerAddress: lock.actors[2],
            secretHashA1: lock.secretHashes[0],
            secretHashB1: lock.secretHashes[1],
            secretA1: lock.secrets[0],
            secretB1: lock.secrets[1],
            loanExpiration: lock.expirations[0].toString(),
            collateral: (new BigNumber(lock.details[0]).dividedBy(1e18)).toString(),
            collateralValue: (new BigNumber(lock.details[1]).dividedBy(1e18)).toString(),
            lockPrice: (new BigNumber(lock.details[2]).dividedBy(1e18)).toString(),
            liquidationPrice: (new BigNumber(lock.details[3]).dividedBy(1e18)).toString(),
            status: lock.state,
            blockchain,
            network,
            collateralLockContractAddress: protocolContract.address,
            loansContractAddress: lock.loansContractAddress
        }
    })

    if (created && lock.state == 0) {

        const dbLoan = await Loan.findOne({
            where: {
                contractLoanId: lock.bCoinLoanId,
                loansContractAddress: lock.loansContractAddress,
                status: 1
            },
        })

        if (!dbLoan) {
            console.log('Matching loan not found for lock: ', logs.loanId)
        }

        // Hide Loan From Available Loans List
        dbLoan.status = 1.5
        await dbLoan.save()

        if (network === 'testnet') {
            // Assign borrower to loan
            console.log('MATCHING COLLATERAL & LOAN:')

            await Matching.findOrCreate({
                where: {
                    collateralLockTxHash: txHash,
                },
                defaults: {
                    collateralLockTxHash: txHash,
                    collateralLockBlockchain: blockchain,
                    collateralLockContract: protocolContract.address,
                    loansBlockchain: dbLoan.blockchain,
                    loansContract: lock.loansContractAddress,
                    network: network,
                    aCoinLoanId: logs.loanId,
                    bCoinLoanId: lock.bCoinLoanId,
                    bCoinBorrowerAddress: lock.actors[2],
                    secretHashA1: lock.secretHashes[0],
                    transactionSent: 0,
                    matchingCompleted: 0
                },
            })
        }

        // Send Email Notification (Borrower & Lender)
        try {
            emailNotification.sendCollateralLocked(dbCollateralLock.id)
                .then(res => console.log(res))
        } catch (e) {
            console.error(e)
        }

    } else {
        dbCollateralLock.secretA1 = lock.secrets[0]
        dbCollateralLock.secretB1 = lock.secrets[1]
        dbCollateralLock.status = lock.state
        await dbCollateralLock.save()

        if (operation === 'UnlockAndClose') {
            try {
                emailNotification.sendCollateralUnlocked(dbCollateralLock.id)
            } catch (e) {
                console.error(e)
            }
        } else if (operation === 'SeizeCollateral') {
            try {
                emailNotification.sendCollateralSeized(dbCollateralLock.id)
            } catch (e) {
                console.error(e)
            }
        }
    }

    sendJSONresponse(res, 200, { status: 'OK', message: 'Collateral Lock Operation Confirmed' })
    return

}

module.exports.updateCollateralLockData_ONE = async (req, res) => {
    const { network } = req.params

    if (!network) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing network' })
        return
    }

    let endpoint

    if (network === 'mainnet') {
        endpoint = await Endpoint.findOne({
            where: {
                blockchain: 'ONE',
                endpointType: 'HTTP',
                shard: '0',
                network: 'mainnet',
                status: 'ACTIVE'
            }
        })
    } else if (network === 'testnet') {
        endpoint = await Endpoint.findOne({
            where: {
                blockchain: 'ONE',
                endpointType: 'HTTP',
                shard: '0',
                network: 'testnet',
                status: 'ACTIVE'
            }
        })
    }

    if (!endpoint) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Endpoint not found' })
        return
    }

    const protocolContract = await ProtocolContract.findOne({
        where: {
            name: 'CollateralLockV2',
            network,
            blockchain: 'ONE',
            version: '0',
            status: 'ACTIVE'
        }
    })

    if (!protocolContract) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Protocol Contract not found' })
        return
    }

    // Connect HTTP Provider
    let hmy
    try {
        hmy = new Harmony(endpoint.endpoint, { chainType: ChainType.Harmony, chainId: network === 'mainnet' ? ChainID.HmyMainnet : ChainID.HmyTestnet })
    } catch (e) {
        console.log(e)
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Error connecting to Harmony HTTP provider' })
        return
    }

    // Instantiate CollateralLockV2 contract
    let contract
    try {
        contract = hmy.contracts.createContract(protocolContract.address)
    } catch (e) {
        console.log(e)
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'An error occurred, please try again' })
        return
    }
}

module.exports.updateCollateralLockData_ETH = async (req, res) => {
    const { network } = req.params

    if (!network) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing network' })
        return
    }
}