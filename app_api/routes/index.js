const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')

// Controllers
const collateralLock = require('../controllers/collateralLock')
const loanAsset = require('../controllers/loanAsset')
const assetLogo = require('../controllers/assetLogo')
const protocolContract = require('../controllers/protocolContract')
const engine = require('../controllers/engine')
const loan = require('../controllers/loan')
const matching = require('../controllers/matching')
const loanEvent = require('../controllers/loanEvent')
const emailNotification = require('../controllers/emailNotification')
const oracle = require('../controllers/oracle')
const test = require('../controllers/test')


// router.get('/loan/:blockchain/:network/:event/:txHash', loan.saveLoanEvent)
router.post('/loan/ETH/operation/confirm', loan.confirmLoanOperation_ETH)
router.get('/loans/:status/:network', loan.getLoansByStatus)
router.get('/loan/:loanId', loan.getLoanDetails)
router.get('/loans/account/:account/:network', loan.getAccountLoans)

// Collateral Lock
router.post('/collateralLock/ONE/operation/confirm', collateralLock.confirmCollateralLockOperation_ONE)


router.get('/updateCollateralLock_ONE/:network', collateralLock.updateCollateralLockData_ONE)
router.get('/updateCollateralLock_ETH/:network', collateralLock.updateCollateralLockData_ETH)
router.get('/loanAssets/:blockchain/:network', loanAsset.getLoanAssets)
router.get('/logo/:blockchain/:symbol', assetLogo.getAssetLogo)
router.get('/protocolContracts/', protocolContract.getProtocolContracts)

router.get('/engine/secretHash/:blockchain/new', engine.generateSecretHash)

// Matching 
router.get('/engine/match/pending', matching.sendPendingTxs)
// router.get('/engine/matching/confirmMatch', matching.confirmMatchTxs)

// Activity
router.get('/activity/history/:page?', loanEvent.getActivityHistory)

// Email Notification
router.get('/notification/email/:account', emailNotification.getEmailNotificationAccount)
router.post('/notification/email', emailNotification.saveEmailNotificationAccount)
router.get('/emailNotification/test', emailNotification.test)

// Price Oracles
router.get('/oracle/ONE/:network', oracle.updateAggregatorPrice_ONE)

// Test
router.get('/test/email', test.emailTest)

module.exports = router