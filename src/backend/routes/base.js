const express = require('express')
const router = express.Router()

const BaseController = require('../controllers/BaseController')

router.get('/view', BaseController.viewBases)
router.get('/create', BaseController.showCreateBasePage)
router.post('/create', BaseController.createBase)
router.post('/delete', BaseController.deleteBase)

module.exports = router