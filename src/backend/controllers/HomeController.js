const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const jwt = require('jsonwebtoken')
const {mongooseToObject} = require('../../backend/ulti/mongoose')
const Bases = require('../models/Bases')
require('dotenv').config()

class HomeController {
    //[GET] /search?id=
    search(req, res, next) {
        Parcels.findById(req.query.id)
            .then(parcel => {
                if (parcel) {
                    res.status(200).json({
                        parcel: mongooseToObject(parcel)
                    })
                } else {
                    res.status(404).json({message: 'parcel not found'})
                }
            })
            .catch(err => {
                res.status(400).json("bad request")
            })
    }

    //[POST] /login
    login(req, res, next) {
        var username = req.body.username
        var password = req.body.password

        Actors.findOne({username: username, password: password})
            .then(actor => {
                var account = {}
                if (actor) {
                    actor = mongooseToObject(actor)
                    var cookie = jwt.sign({
                        userID: actor._id, 
                        userRole: actor.role,
                        workAt: actor.workAt
                    }, process.env.TOKEN_KEY)

                    res.set({
                        "Access-Control-Allow-Origin": `http://localhost:${process.env.CLIENT_PORT}`,
                        "Access-Control-Allow-Credentials": true
                    })
                    res.cookie('jwt', cookie, {maxAge: 90000, httpOnly: false})
                    res.status(200).json({
                        role: actor.role
                    })
                    
                } else {
                    res.status(400).json({
                        message: 'Invalid Credentials'
                    })
                }
            })
    }

    //[POST] /logout
    logout(req, res, next) {
        res.clearCookie('jwt')
        res.status(200).json("Logout successfully")
    }
}
module.exports = new HomeController