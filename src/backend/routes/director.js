const express = require('express')
const router = express.Router()

const DirectorController = require('../controllers/DirectorController')

router.post('/create-account', DirectorController.createAccount)
router.post('/create-base', DirectorController.createBase)

module.exports = router