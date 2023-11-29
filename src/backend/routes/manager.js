const express = require('express')
const router = express.Router()

const ManagerController = require('../controllers/ManagerController')
const { model } = require('mongoose')

router.get('/accounts/edit', ManagerController.editAccount)
router.get('/accounts', ManagerController.showAccounts)
router.post('/accounts/create', ManagerController.createAccount)
router.put('/accounts/edit', ManagerController.updateAccount)
router.delete('/accounts/delete', ManagerController.deleteAccount)
router.delete('/accounts/multiple-delete', ManagerController.deleteMultipleAccounts)

module.exports = router