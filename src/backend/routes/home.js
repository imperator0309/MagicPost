const express = require('express')
const router = express.Router()

const HomeController = require('../controllers/HomeController')

router.get('/search', HomeController.search)
router.post('/login', HomeController.login)
router.post('/logout', HomeController.logout)

module.exports = router