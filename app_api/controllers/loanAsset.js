const { sendJSONresponse } = require('../utils')
const {
    LoanAsset
} = require('../models/sequelize')

module.exports.getLoanAssets = async (req, res) => {
    const { network, blockchain } = req.params

    if (!network || !blockchain) {
        sendJSONresponse(res, 422, { status: 'ERROR', message: 'Missing required parameters' })
        return
    }

    let loanAssets

    if (blockchain === 'all') {
        loanAssets = await LoanAsset.findAll({
            where: {
                network,
                status: 'ACTIVE'
            },
            attributes: ['id', 'name', 'symbol','contractAddress', 'blockchain', 'network', 'status'],
            raw: true
        })
    } else {
        loanAssets = await LoanAsset.findAll({
            where: {
                blockchain,
                network,
                status: 'ACTIVE'
            },
            attributes: ['id', 'name', 'symbol','contractAddress', 'blockchain', 'network', 'status'],
            raw: true

        })
    }

    const payload = {}

    for(let a of loanAssets) {
        payload[a.contractAddress] = {
            ...a
        }
    }

    sendJSONresponse(res, 200, { status: 'OK', payload: payload })
    return
}

