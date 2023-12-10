const express = require('express')
const router = express.Router()

const DirectorController = require('../controllers/DirectorController')

router.post('/accounts/create', DirectorController.createAccount)
router.post('/bases/create', DirectorController.createBase)
router.delete('/accounts/delete', DirectorController.deleteAccount)
router.delete('/bases/delete', DirectorController.deleteBase)
router.get('/accounts/edit', DirectorController.editAccount)
router.put('/accounts/edit', DirectorController.updateAccount)
router.get('/accounts', DirectorController.showAccounts)
router.get('/bases', DirectorController.showBases)
module.exports = router