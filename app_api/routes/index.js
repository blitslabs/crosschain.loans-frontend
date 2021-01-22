const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')

// Controllers
const collateralLock = require('../controllers/collateralLock')
const loanAsset = require('../controllers/loanAsset')
const assetLogo = require('../controllers/assetLogo')
const protocolContract = require('../controllers/protocolContract')

router.get('/updateCollateralLock_ONE/:network', collateralLock.updateCollateralLockData_ONE)
router.get('/updateCollateralLock_ETH/:network', collateralLock.updateCollateralLockData_ETH)
router.get('/loanAssets/:blockchain/:network', loanAsset.getLoanAssets)
router.get('/logo/:blockchain/:symbol', assetLogo.getAssetLogo)
router.get('/protocolContracts/', protocolContract.getProtocolContracts)

module.exports = router