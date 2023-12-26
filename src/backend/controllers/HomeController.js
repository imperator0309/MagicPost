const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const jsonwebtoken = require('jsonwebtoken')
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
                    var jwt = jsonwebtoken.sign({
                        userID: actor._id, 
                        userRole: actor.role,
                        workAt: actor.workAt
                    }, process.env.TOKEN_KEY)
                    
                    res.cookie('jwt', jwt, {httpOnly: false, secure: false, sameSite: "lax"})
                    res.status(200).json({
                        jwt: jwt
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