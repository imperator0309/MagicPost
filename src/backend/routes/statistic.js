const express = require('express')
const router = express.Router()

const StatisticController = require('../controllers/StatisticController')

router.get('/general', StatisticController.showGeneralStatistic)
router.get('/base', StatisticController.showStatisticByBase)
router.get('/from-sender', StatisticController.showFromSenderStatistic)
router.get('/to-receiver', StatisticController.showToReceiverStatistic)

module.exports = router