const express = require('express')
const router = express.Router()

const ParcelController = require('../controllers/ParcelController')
const HistoryController = require('../controllers/HistoryController')

router.post('/create', ParcelController.createParcel)

router.get('/incoming/from-distribution-base', ParcelController.showIncomingFromDistributionBase)
router.get('/incoming/from-transaction-base', ParcelController.showIncomingFromTransactionBase)
router.get('/to-distribution-base', ParcelController.showToDistributionBase)
router.get('/to-transaction-base', ParcelController.showToTransactionBase)
router.get('/to-receiver/in-queue', ParcelController.showToReceiver)
router.get('/to-receiver/delivering', ParcelController.showToReceiverDelivering)

router.get('/history/general', HistoryController.showHistory)
router.get('/history/from-receiver', HistoryController.showFromReceiverHistory)
router.get('/history/to-receiver', HistoryController.showToReceiverHistory)

router.put('/incoming', ParcelController.confirmIncomingParcels)
router.put('/to-distribution-base', ParcelController.forwardToDistributionBase)
router.put('/to-transaction-base', ParcelController.forwardToTransactionBase)
router.put('/to-receiver/in-queue', ParcelController.forwardToReceiver)
router.put('/to-receiver/delivering', ParcelController.confirmToReceiver)

module.exports = router