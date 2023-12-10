const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const Bases = require('../models/Bases')

class HomeController {
    //[GET] /search
    search(req, res, next) {
        var parcelID = req.query.parcelID
        Parcels.findById(parcelID)
            .then(parcel => {
                if (parcel) {
                    res.status(200).json({
                        parcel: mongooseToObject(parcel)
                    })
                } else {
                    res.status(404).json({message: 'parcel not found'})
                }
            })
            .catch(next)
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

                    res.cookie('jwt', cookie)
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
}
module.exports = new HomeController