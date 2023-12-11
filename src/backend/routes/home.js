const express = require('express')
const router = express.Router()

const HomeController = require('../controllers/HomeController')

router.get('/search', HomeController.search)
router.post('/login', HomeController.login)

module.exports = router