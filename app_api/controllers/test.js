const emailNotification = require('./emailNotification')
const { sendJSONresponse } = require('../utils')

module.exports.emailTest = async (req, res) => {
    emailNotification.sendCollateralUnlocked(43)
    sendJSONresponse(res, 200, { status: 'OK', message: 'Email sent!'})
    return
}