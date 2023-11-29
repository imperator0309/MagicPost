const express = require('express')
const router = express.Router()

const DirectorController = require('../controllers/DirectorController')

router.post('/accounts/create', DirectorController.createAccount)
router.post('/bases/create', DirectorController.createBase)
router.delete('/accounts/delete', DirectorController.deleteAccount)
router.delete('/accounts/multiple-delete', DirectorController.deleteMultipleAccounts)
router.delete('/bases/delete', DirectorController.deleteBase)
router.delete('/bases/multiple-delete', DirectorController.deleteMultipleBases)
router.get('/accounts/edit', DirectorController.editAccount)
router.get('/bases/edit', DirectorController.editBase)
router.put('/accounts/edit', DirectorController.updateAccount)
router.put('/bases/edit', DirectorController.updateBase)
router.get('/accounts', DirectorController.showAccounts)
router.get('/bases', DirectorController.showBases)
module.exports = router