const { sendJSONresponse } = require('../utils')
const {
    ProtocolContract
} = require('../models/sequelize')

module.exports.getProtocolContracts = async (req, res) => {


    const protocolContracts = await ProtocolContract.findAll({ raw: true })
    const payload = {}

    for (let c of protocolContracts) {
        console.log()
        payload[c.network] = {
            ...payload[c.network],
            [c.name]: { ...c }
        }
    }

    sendJSONresponse(res, 200, { status: 'OK', payload: payload })
    return
}