const express = require('express')
const router = express.Router()

const MyController = require('../controllers/MyController')

router.get('/statistic/from-sender', MyController.showFromSenderStatistic)
router.get('/statistic/to-receiver', MyController.showToReceiverStatistic)
router.get('/statistic', MyController.showStatisticByBase)
router.get('/', MyController.show)

module.exports = router