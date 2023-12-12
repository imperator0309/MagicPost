const express = require('express')
const router = express.Router()

const ParcelController = require('../controllers/ParcelController')

router.get('/transaction-base/to-distribution-base/in-queue', ParcelController.showToDistributionBaseInQueue)
router.get('/transaction-base/to-distribution-base/history', ParcelController.showToDistributionBaseHistory)
router.get('/transaction-base/incoming', ParcelController.showIncoming)
router.get('/transaction-base/to-receiver/in-queue', ParcelController.showToReceiverInQueue)
router.get('/transaction-base/to-receiver/delivering', ParcelController.showToReceiverDelivering)
router.get('/transaction-base/to-receiver/history', ParcelController.showToReceiverHistory)
router.get('/distribution-base/incoming/transaction-base', ParcelController.showTransactionBaseIncoming)
router.get('/distribution-base/incoming/distribution-base', ParcelController.showDistributionBaseIncoming)
router.get('/distribution-base/to-transaction-base/in-queue', ParcelController.showToTransactionBaseInQueue)
router.get('/distribution-base/to-distribution-base/in-queue', ParcelController.showToDestinedDistributionBase)

router.post('/transaction-base/create', ParcelController.createParcel)

router.put('/transaction-base/to-distribution-base/in-queue', ParcelController.forwardToDistributionBase)
router.put('/transaction-base/incoming', ParcelController.confirmIncoming)
router.put('/transaction-base/to-receiver/in-queue', ParcelController.forwardToReceiver)
router.put('/transaction-base/to-receiver/delivering', ParcelController.confirmToReceiverStatus)
router.put('/distribution-base/incoming/transaction-base', ParcelController.confirmTransactionBaseIncoming)
router.put('/distribution-base/incoming/distribution-base', ParcelController.confirmDistributionBaseIncoming)
router.put('/distribution-base/to-transaction-base/in-queue', ParcelController.forwardToTransactionBase)
router.put('/distribution-base/to-distribution-base/in-queue', ParcelController.forwardToDestinedDistributionBase)

module.exports = router