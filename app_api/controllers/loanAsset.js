const { sendJSONresponse } = require('../utils')
const {
    LoanAsset
} = require('../models/sequelize')

module.exports.getLoanAssets = async (req, res) => {
    const { networkId } = req.params

    if (!networkId) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required parameters' })
        return
    }

    const loanAssets = await LoanAsset.findAll({
        where: {
            networkId,
            status: 'ACTIVE'
        },
        attributes: ['id', 'name', 'symbol', 'contractAddress', 'blockchain', 'networkId', 'status'],
        raw: true
    })


    const payload = {}

    for (let a of loanAssets) {
        payload[a.contractAddress] = {
            ...a
        }
    }

    sendJSONresponse(res, 200, { status: 'OK', payload: payload })
    return
}

