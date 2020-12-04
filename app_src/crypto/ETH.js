import Web3 from 'web3'
import { sha256 } from '@liquality-dev/crypto'
import ABI from './ABI'

const ETH = {
    generateSecret: async (message) => {
        if (!window.ethereum) {
            return { status: 'ERROR', message: 'No web3 provider detected' }
        }

        // Connect to HTTP Provider
        const web3 = new Web3(window.ethereum)

        await window.ethereum.enable()

        const accounts = await web3.eth.getAccounts()
        const from = accounts[0]

        try {
            // Sign Message
            const signedMessage = await web3.eth.personal.sign(message, from)

            // Generate Secret
            const secret = sha256(signedMessage)

            // Generate Secret Hash
            const secretHash = `0x${sha256(secret)}`

            return { status: 'OK', payload: { secret, secretHash } }

        } catch (e) {
            return { status: 'ERROR', message: 'Error signing message' }
        }
    },

    getAllowance: async (spender, tokenContractAddress) => {
        if (!window.ethereum) {
            return { status: 'ERROR', message: 'No web3 provider detected' }
        }

        if (!spender) return { status: 'ERROR', message: 'Missing spender' }
        if (!tokenContractAddress) return { status: 'ERROR', message: 'Missing token contract address' }

        await window.ethereum.enable()

        // Connect to HTTP Provider
        const web3 = new Web3(window.ethereum)

        // Instantiate token contract
        let token
        try {
            token = new web3.eth.Contract(ABI.ERC20.abi, tokenContractAddress)
        } catch (e) {
            return { status: 'ERROR', message: 'Error instantiating token contract' }
        }

        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]

        try {

            const allowance = await token.methods.allowance(account, spender).call()
            return { status: 'OK', payload: web3.utils.toWei(allowance) }

        } catch (e) {
            return { status: 'ERROR', message: 'Error getting allowance' }
        }
    },

    approveAllowance: async (spender, amount, tokenContractAddress) => {
        if (!window.ethereum) {
            return { status: 'ERROR', message: 'No web3 provider detected' }
        }

        if (!spender) return { status: 'ERROR', message: 'Missing spender' }
        if (!amount) return { status: 'ERROR', message: 'Missing amount' }
        if (!tokenContractAddress) return { status: 'ERROR', message: 'Missing token contract address' }

        // Connect to HTTP Provider
        const web3 = new Web3(window.ethereum)

        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]

        // Instantiate token contract
        let token
        try {
            token = new web3.eth.Contract(ABI.ERC20.abi, tokenContractAddress)
        } catch (e) {
            return { status: 'ERROR', message: 'Error instantiating token contract' }
        }

        try {
            const tx = await token.methods.approve(spender, web3.utils.toWei(amount)).send({ from: account })
            return { status: 'OK', payload: tx }

        } catch (e) {
            return { status: 'ERROR', message: 'Error approving allowance' }
        }
    },

    getAccount: async () => {
        if (!window.ethereum) {
            return { status: 'ERROR', message: 'No web3 provider detected' }
        }

        try {
            // Connect to HTTP Provider
            const web3 = new Web3(window.ethereum)
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            return { status: 'OK', payload: account }
            
        } catch (e) {
            return { status: 'ERROR', payload: 'Error loading ETH account' }
        }
    }
}

export default ETH