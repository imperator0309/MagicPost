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
                    parcel = mongooseToObject(parcel)
                    parcel.queySuccess = 'true'
                } else {
                    parcel = {queySuccess: 'false'}
                }
                res.json(parcel)
            })
            .catch(next)
    }

    //[POST] /login
    login(req, res, next) {
        var username = req.body.username
        var password = req.body.password

        Actors.findOne({username: username, password: password})
            .then(actor => {
                var response = {}
                if (actor) {
                    actor = mongooseToObject(actor)
                    var cookie = jwt.sign({userID:actor._id}, 'secret')
                    response.name = actor.name
                    response.role = actor.role
                    response.queySuccess = 'true'
                    res.cookie('id', cookie)
                } else {
                    response.queySuccess = 'false'
                }
                res.json(response)
            })
    }
}
module.exports = new HomeController