const express = require('express')
const router = express.Router()

const HomeController = require('../app/controllers/HomeController')

router.get('/login', HomeController.login)
router.get('/search', HomeController.search)

module.exports = router

