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

// router.get('/loan/:blockchain/:network/:event/:txHash', loan.saveLoanEvent)
router.post('/loan/ETH/operation/confirm', loan.confirmLoanOperation_ETH)
router.get('/loans/:status', loan.getLoansByStatus)
router.get('/loan/:loanId', loan.getLoanDetails)

router.get('/updateCollateralLock_ONE/:network', collateralLock.updateCollateralLockData_ONE)
router.get('/updateCollateralLock_ETH/:network', collateralLock.updateCollateralLockData_ETH)
router.get('/loanAssets/:blockchain/:network', loanAsset.getLoanAssets)
router.get('/logo/:blockchain/:symbol', assetLogo.getAssetLogo)
router.get('/protocolContracts/', protocolContract.getProtocolContracts)

router.get('/engine/secretHash/:blockchain/new', engine.generateSecretHash)


module.exports = router