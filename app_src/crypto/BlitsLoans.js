import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import ABI from './ABI'

// Harmony
import { Harmony, HarmonyExtension } from '@harmony-js/core'
import { ChainID, ChainType, Unit, Units } from '@harmony-js/utils'
import { fromBech32, toBech32 } from '@harmony-js/crypto'

const ONE = {
    mainnet_endpoints: {
        shard_0_endpoint: 'https://api.s0.t.hmny.io',
        shard_1_endpoint: 'https://api.s1.t.hmny.io',
        shard_2_endpoint: 'https://api.s2.t.hmny.io',
        shard_3_endpoint: 'https://api.s3.t.hmny.io',
        shard_0_websocket: 'wss://ws.s0.t.hmny.io',
        shard_1_websocket: 'wss://ws.s1.t.hmny.io',
        shard_2_websocket: 'wss://ws.s2.t.hmny.io',
        shard_3_websocket: 'wss://ws.s3.t.hmny.io',
    },
    testnet_endpoints: {
        shard_0_endpoint: 'https://api.s0.b.hmny.io',
        shard_1_endpoint: 'https://api.s1.b.hmny.io',
        shard_2_endpoint: 'https://api.s2.b.hmny.io',
        shard_3_endpoint: 'https://api.s3.b.hmny.io',
        shard_0_websocket: 'wss://ws.s0.t.hmny.io',
        shard_1_websocket: 'wss://ws.s0.t.hmny.io',
        shard_2_websocket: 'wss://ws.s0.t.hmny.io',
        shard_3_websocket: 'wss://ws.s0.t.hmny.io',
    },
}

const BlitsLoans = {
    ETH: {
        getAssetTypeData: async (tokenContractAddress, loansContract) => {

            if (!window.ethereum) {
                return { status: 'ERROR', message: 'No web3 provider detected' }
            }

            // Connect to HTTP Provider
            const web3 = new Web3(window.ethereum)

            // Instantiate Contract
            let contract
            try {
                contract = new web3.eth.Contract(ABI.LOANS.abi, loansContract)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating contract' }
            }

            let assetType, interestRate

            try {
                assetType = await contract.methods.getAssetType(tokenContractAddress).call()
                interestRate = await contract.methods.getAssetInterestRate(tokenContractAddress).call()
            } catch (e) {
                console.log(e)
                return false
            }

            const payload = {
                interestRate: web3.utils.fromWei(interestRate),
                maxLoanAmount: web3.utils.fromWei(assetType.maxLoanAmount),
                minLoanAmount: web3.utils.fromWei(assetType.minLoanAmount),
                multiplierPerPeriod: web3.utils.fromWei(assetType.multiplierPerPeriod),
                baseRatePerPeriod: web3.utils.fromWei(assetType.baseRatePerPeriod),
                enabled: assetType.enabled
            }

            return payload
        },

        getAccountLoans: async(loansContractAddress) => {
            if(!window.ethereum) {
                return { status: 'ERROR', message: 'No web3 provider detected'}
            }

            if(!loansContractAddress) return { status: 'ERROR', message: 'Missing loans contract address'}

            await window.ethereum.enable()

            // Connect to web3 provider
            const web3 = new Web3(window.ethereum)

            // Get Lender Account
            const accounts = await web3.eth.getAccounts()
            const lender = accounts[0]

            // Instantiate Contract
            let contract
            try {
                contract  = new web3.eth.Contract(ABI.LOANS.abi, loansContractAddress)
            } catch(e) {
                return { status: 'ERROR', message: 'Error instantiating contract'}
            }

            const accountLoans = await contract.methods.userLoans(lender).call()
            console.log(accountLoans)
            return accountLoans
        },


        createLoan: async (lenderAuto, secretHashB1, secretHashAutoB1, principal, tokenContractAddress, loansContractAddress, aCoinLenderAddress) => {

            if (!window.ethereum) {
                return { status: 'ERROR', message: 'No web3 provider detected' }
            }

            if (!lenderAuto) return { status: 'ERROR', message: 'Missing autolender address' }
            if (!secretHashB1) return { status: 'ERROR', message: 'Missing secretHashB1' }
            if (!secretHashAutoB1) return { status: 'ERROR', message: 'Missing secretHashAutoB1' }
            if (!principal) return { status: 'ERROR', message: 'Missing principal' }
            if (!tokenContractAddress) return { status: 'ERROR', message: 'Missing token address' }
            if (!loansContractAddress) return { status: 'ERROR', message: 'Missing loans contract address' }
            if (!aCoinLenderAddress) return { status: 'ERROR', message: 'Missing lender\'s acoin address ' }

            await window.ethereum.enable()

            // Connect to HTTP Provider
            const web3 = new Web3(window.ethereum)

            // Get Lender account
            const accounts = await web3.eth.getAccounts()
            const lender = accounts[0]

            // Instantiate Contract
            let contract
            try {
                contract = new web3.eth.Contract(ABI.LOANS.abi, loansContractAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating contract' }
            }

            // Instantiate token contract
            let token
            try {
                token = new web3.eth.Contract(ABI.ERC20.abi, tokenContractAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating token contract' }
            }

            let amount = BigNumber(principal)

            // Get Token Balance
            let balance = await token.methods.balanceOf(lender).call()
            balance = BigNumber(web3.utils.fromWei(balance))

            // Check Balance
            if (balance.lt(amount)) {
                return { status: 'ERROR', message: 'Insufficient balance' }
            }

            // Allowance
            let allowance = await token.methods.allowance(lender, loansContractAddress).call()
            allowance = BigNumber(web3.utils.fromWei(allowance))

            if (!allowance || allowance.lt(amount)) {
                return { status: 'ERROR', message: 'Insufficient allowance' }
            }

            amount = web3.utils.toWei(amount.toString())

            // Encode aCoinLenderAddress
            aCoinLenderAddress = web3.utils.toHex(aCoinLenderAddress)

            try {
                const tx = await contract.methods.createLoan(
                    lenderAuto, secretHashB1, secretHashAutoB1,
                    amount, tokenContractAddress, aCoinLenderAddress
                ).send({ from: lender })
                return { status: 'OK', payload: tx }
            } catch (e) {
                return { status: 'ERROR', message: 'Error creating loan' }
            }

        },

        withdrawPrincipal: async (loanId, secretA1, loansContractAddress) => {

            if (!window.ethereum) {
                return { status: 'ERROR', message: 'No web3 provider detected' }
            }

            if (!loanId) return { status: 'ERROR', message: 'Missing Loan ID' }
            if (!secretA1) return { status: 'ERROR', message: 'Missing secretA1' }
            if (!loansContractAddress) return { status: 'ERROR', message: 'Missing Loans Contract Address' }

            await window.ethereum.enable()

            // Connect to HTTP Provider
            const web3 = new Web3(window.ethereum)

            // Get Lender account
            const accounts = await web3.eth.getAccounts()
            const borrower = accounts[0]

            // Instantiate Contract
            let contract
            try {
                contract = new web3.eth.Contract(ABI.LOANS.abi, loansContractAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating contract' }
            }

            try {
                const tx = await contract.methods.withdraw(
                    loanId, secretA1
                ).send({ from: borrower })

                return { status: 'OK', payload: tx }
            } catch (e) {
                console.log(e)
                return { status: 'ERROR', message: e ? e : 'Error withdrawing principal' }
            }
        },


        repayLoan: async (loanId, loansContractAddress) => {

            if (!window.ethereum) {
                return { status: 'ERROR', message: 'No web3 provider detected' }
            }

            if (!loanId) return { status: 'ERROR', message: 'Missing Loan ID' }
            if (!loansContractAddress) return { status: 'ERROR', message: 'Missing Loans Contract Address' }

            await window.ethereum.enable()

            // Connect to HTTP Provider
            const web3 = new Web3(window.ethereum)

            // Get Lender account
            const accounts = await web3.eth.getAccounts()
            const borrower = accounts[0]

            // Instantiate Contract
            let contract
            try {
                contract = new web3.eth.Contract(ABI.LOANS.abi, loansContractAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating contract' }
            }

            try {
                const tx = await contract.methods.payback(loanId).send({ from: borrower })
                return { status: 'OK', payload: tx }
            } catch (e) {
                console.log(e)
                return { status: 'ERROR', message: e ? e : 'Error repaying loan' }
            }
        },

        acceptRepayment: async (loanId, secretB1, loansContractAddress) => {

            if (!window.ethereum) {
                return { status: 'ERROR', message: 'No web3 provider detected' }
            }

            if (!loanId) return { status: 'ERROR', message: 'Missing Loan ID' }
            if (!secretB1) return { status: 'ERROR', message: 'Missing secretB1' }
            if (!loansContractAddress) return { status: 'ERROR', message: 'Missing Loans Contract Address' }

            await window.ethereum.enable()

            // Connect to HTTP Provider
            const web3 = new Web3(window.ethereum)

            // Get Lender account
            const accounts = await web3.eth.getAccounts()
            const lender = accounts[0]

            // Instantiate Contract
            let contract
            try {
                contract = new web3.eth.Contract(ABI.LOANS.abi, loansContractAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating contract' }
            }

            try {
                const tx = await contract.methods.acceptRepayment(
                    loanId, secretB1
                ).send({ from: lender })
                return { status: 'OK', payload: tx }
            } catch (e) {
                console.log(e)
                return { status: 'ERROR', message: e ? e : 'Error accepting loan payback' }
            }
        },
    },


    ONE: {
        lockCollateral: async (amount, lender, secretHashA1, secretHashB1, lockContractAddress, bCoinBorrowerAddress, shard, network) => {
            if (!window.onewallet) {
                return { status: 'ERROR', message: 'Harmony Provider not found' }
            }

            if (!amount) return { status: 'ERROR', message: 'Missing amount' }
            if (!lender) return { status: 'ERROR', message: 'Missing lender' }
            if (!secretHashA1) return { status: 'ERROR', message: 'Missing secretHashA1' }
            if (!secretHashB1) return { status: 'ERROR', message: 'Missing secretHashB1' }
            if (!lockContractAddress) return { status: 'ERROR', message: 'Missing lockContractAddress' }
            if (!bCoinBorrowerAddress) return { status: 'ERROR', message: 'Missing bCoinBorrowerAddress' }
            if (!shard) return { status: 'ERROR', message: 'Missing shard' }
            if (!network) return { status: 'ERROR', message: 'Missing network' }

            const endpoint = network === 'mainnet' ? ONE.mainnet_endpoints['shard_' + shard + '_endpoint'] : ONE.testnet_endpoints['shard_' + shard + '_endpoint']
            const chainId = network === 'mainnet' ? ChainID.HmyMainnet : ChainID.HmyTestnet
            
            // Connect HTTP Provider
            let harmony, hmy
            try {
                harmony = new HarmonyExtension(window.onewallet)
                harmony.setProvider(endpoint)
                harmony.setShardID(0)
            } catch (e) {
                console.log(e)
                return { status: 'ERROR', message: 'Error connecting Harmony provider' }
            }

            // Connect Account / Unlock Wallet
            const account = await harmony.login()
            console.log(account)

            // Check account's balance



            // Instantiate Contract
            let contract
            try {
                contract = await harmony.contracts.createContract(ABI.COLLATERAL_LOCK.abi, lockContractAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating contract' }
            }

            // Encode bCoinBorrowerAddress
            try {
                const web3 = new Web3(window.ethereum)
                bCoinBorrowerAddress = web3.utils.toHex(bCoinBorrowerAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Web3 provider not found' }
            }

            try {
                // Get checksum address
                lender = fromBech32(lender)

                await contract.methods.lockCollateral(
                    lender, secretHashA1, secretHashB1, bCoinBorrowerAddress
                ).send({
                    value: BigNumber(amount).multipliedBy('1000000000000000000').toString(),
                    gasLimit: '1000001',
                    gasPrice: (BigNumber('1').multipliedBy('1000000000')).toString(),
                })
                    .on('transactionHash', (hash) => console.log('hash', hash))
                    .on('receipt', (receipt) => console.log('receipt', receipt))
                    .on('confirmation', async (confirmation) => {
                        console.log(confirmation)
                        if (confirmation === 'REJECTED') return { status: 'ERROR', message: 'Transaction Rejected' }
                        return { status: 'OK', payload: confirmation }
                    })
                    .on('error', (error) => {
                        console.log(error)
                        return { status: 'ERROR', message: error ? error : 'Error unlocking collateral' }
                    })
                
                return { status: 'OK', payload: 'tx' }

            } catch (e) {
                console.log(e)
                return { status: 'ERROR', message: e ? e : 'Error sending transaction' }
            }
        },

        unlockCollateral: async (loanId, secretB1, lockContractAddress, shard, network) => {
            if (!window.onewallet) {
                return { status: 'ERROR', message: 'Harmony Provider not found' }
            }

            if (!loanId) return { status: 'ERROR', message: 'Missing Loan ID' }
            if (!secretB1) return { status: 'ERROR', message: 'Missing secretB1' }
            if (!lockContractAddress) return { status: 'ERROR', message: 'Missing lockContractAddress' }
            if (!shard) return { status: 'ERROR', message: 'Missing shard' }
            if (!network) return { status: 'ERROR', message: 'Missing network' }

            const endpoint = network === 'mainnet' ? ONE.mainnet_endpoints['shard_' + shard + '_endpoint'] : ONE.testnet_endpoints['shard_' + shard + '_endpoint']
            const chainId = network === 'mainnet' ? ChainID.HmyMainnet : ChainID.HmyTestnet

            // Connect HTTP Provider
            let harmony, hmy
            try {
                harmony = new HarmonyExtension(window.onewallet)
                harmony.setProvider(endpoint)
                harmony.setShardID(0)
            } catch (e) {
                console.log(e)
                return { status: 'ERROR', message: 'Error connecting Harmony provider' }
            }

            // Connect Account / Unlock Wallet
            const account = await harmony.login()
            console.log(account)

            // Instantiate Contract
            let contract
            try {
                contract = await harmony.contracts.createContract(ABI.COLLATERAL_LOCK.abi, lockContractAddress)
            } catch (e) {
                return { status: 'ERROR', message: 'Error instantiating contract' }
            }

            try {
                const tx = await contract.methods.unlockCollateralAndCloseLoan(
                    loanId, secretB1
                ).send({
                    value: '0x0',
                    gasLimit: '6721900',
                    gasPrice: (BigNumber('1').multipliedBy('1000000000')).toString(),
                })
                    .on('transactionHash', (hash) => console.log('hash', hash))
                    .on('receipt', (receipt) => console.log('receipt', receipt))
                    .on('confirmation', async (confirmation) => {
                        console.log(confirmation)
                        if (confirmation === 'REJECTED') return { status: 'ERROR', message: 'Transaction Rejected' }
                        return { status: 'OK', payload: confirmation }
                    })
                    .on('error', (error) => {
                        console.log(error)
                        return { status: 'ERROR', message: error ? error : 'Error unlocking collateral' }
                    })

                return tx

            } catch (e) {
                console.log(e)
                return { status: 'ERROR', message: e ? e : 'Error sending transaction' }
            }
        }
    }
}

export default BlitsLoans