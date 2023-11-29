const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const {addSecret, removeSecret, getSecret} = require('../ulti/mappingSecret')

class HomeController {
    //[GET] /search
    search(req, res, next) {
        var parcelID = req.query.parcelID
        Parcels.findById(parcelID)
            .then(parcel => {
                if (parcel) {
                    res.json({
                        queySuccess: 'true',
                        parcel: mongooseToObject(parcel)
                    })
                } else {
                    res.json({queySuccess: 'false'})
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
                    var cookie = jwt.sign({userID:actor._id}, 'secret')
                    account.name = actor.name
                    account.role = actor.role
                    res.cookie('id', cookie)
                    res.json({
                        queySuccess: 'true',
                        account: account
                    })
                } else {
                    res.json({
                        queySuccess: 'false'
                    })
                }
            })
    }
}
module.exports = new HomeController