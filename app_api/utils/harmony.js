const rp = require('request-promise')

module.exports.getTxReceipt = function (params) {
    return rp(params.endpoint, {
        method: 'POST',
        body: {
            jsonrpc: "2.0",
            id: 1,
            method: "hmyv2_getTransactionReceipt",
            params: [params.txHash]
        },
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    })
}

module.exports.getCurrentBlockNumber = function(params) {
    return rp(params.endpoint, {
        method: 'POST',
        body: {
            jsonrpc: "2.0",
            id: 1,
            method: "hmyv2_blockNumber",
            params: []
        },
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    })
}