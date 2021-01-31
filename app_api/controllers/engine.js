const { sendJSONresponse } = require('../utils')
const { AutoLender, SecretHash } = require('../models/sequelize')
const Web3 = require('web3')
const crypto = require('crypto')
const { sha256 } = require('@liquality-dev/crypto')

module.exports.generateSecretHash = async (req, res) => {

    const { blockchain } = req.params

    if(!blockchain) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required parameters'})
        return
    }

    const autoLender = await AutoLender.findOne({ blockchain })

    if(!autoLender) {
        sendJSONresponse(res, 404, { status: 'ERROR', message: 'Requested blockchain not found'})
        return
    }

    const random = crypto.randomBytes(64).toString('hex')
    const secret = sha256(random)
    const secretHash = sha256(secret)

    await SecretHash.create({
        account: autoLender.publicKey,
        secret:  `0x${secret}`,
        secretHash: `0x${secretHash}`
    })
    
    const payload = {
        account: autoLender.publicKey,
        secretHash: `0x${secretHash}`
    }

    sendJSONresponse(res, 200, { status: 'OK', payload: payload })
    return
}
