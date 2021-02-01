const Web3 = require('web3')
const { Harmony } = require('@harmony-js/core')
const { ChainID, ChainType } = require('@harmony-js/utils')
const { ABI } = require('../config/ABI')
const { sendJSONresponse } = require('../utils')
const {
    Endpoint, ProtocolContract, AutoLender
} = require('../models/sequelize')
const rp = require('request-promise')
const BigNumber = require('bignumber.js')

module.exports.updateAggregatorPrice_ONE = async (req, res) => {

    const { network } = req.params
    const blockchain = 'ONE'

    if (!network) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required parameters' })
        return
    }

    const endpoint = await Endpoint.findOne({
        where: {
            endpointType: 'HTTP',
            blockchain,
            network,
        }
    })

    if (!endpoint) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Endpoint not found' })
        return
    }


    const oracleContract = await ProtocolContract.findOne({
        where: {
            name: 'AggregatorTest',
            blockchain,
            network
        }
    })

    if (!oracleContract) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Oracle contract not found' })
        return
    }

    const autoLender = await AutoLender.findOne({
        where: {
            blockchain,
        }
    })

    if (!autoLender) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Admin account not found' })
        return
    }

    // Fetch Prices
    const prices = await rp(
        'https://blits.net/api_wallet/assetPrices',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        }
    )

    if (prices.status !== 'OK') {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Error fetching prices' })
        return
    }

    const price = parseInt(BigNumber(prices.payload.ONE.usd).multipliedBy(1e8))

    if (isNaN(price) || price <= 0) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Invalid price' })
        return
    }

    const options = {
        gasPrice: 10000000000,
        gasLimit: 250000
    }

    try {
        const hmy = new Harmony(endpoint.endpoint, { chainType: ChainType.Harmony, chainId: network === 'mainnet' ? ChainID.HmyMainnet : ChainID.HmyTestnet })
        const contract = hmy.contracts.createContract(ABI.AggregatorTest.abi, oracleContract.address)
        contract.wallet.addByPrivateKey(autoLender.privateKey)
        const response = await contract.methods.updateAnswer(price).send(options)
        sendJSONresponse(res, 200, { status: 'OK', message: 'Oracle prices updated'})
    } catch (e) {
        console.log(e)
        sendJSONresponse(res, 422, { status: 'ERROR', message: e ? e : 'Error sending transaction' })
    }
}