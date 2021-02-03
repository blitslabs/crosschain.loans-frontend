const emailNotification = require('./emailNotification')
const { sendJSONresponse } = require('../utils')

module.exports.emailTest = async (req, res) => {
    await emailNotification.sendPaybackRefunded(43, res)
    
    // sendJSONresponse(res, 200, { status: 'OK', message: 'Email sent!'})
    // return
}