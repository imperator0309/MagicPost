const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/AccountController')

router.get('/view', AccountController.view)
router.get('/create', AccountController.showCreateAccountPage)
router.get('/edit/:id', AccountController.editAccount)
router.post('/create', AccountController.createAccount)
router.put('/edit/:id', AccountController.updateAccount)
router.delete('/delete', AccountController.deleteAccount)

module.exports = router