const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')

class HomeController {
    //[GET] /search
    search(req, res, next) {
        var parcelID = req.body.parcelID
        Parcels.findById(parcelID)
            .then(parcel => {
                if (parcel) {
                    parcel = mongooseToObject(parcel)
                    parcel.queryStatus = 'success'
                } else {
                    parcel = {queryStatus: 'failed'}
                }
                res.json(parcel)
            })
            .catch(next)
    }

    //[POST] /login
    login(req, res, next) {
        var username = req.body.username
        var password = req.body.password

        Actors.find({username: username, password: password})
            .then(actor => {
                actor = multipleMongooseToObject(actor)
                if (actor.length === 1) {
                    actor = actor[0]
                    actor.loginStatus = 'success'
                } else {
                    actor = {loginStatus: 'failed'}
                }
                res.json(actor)
            })
    }
}
module.exports = new HomeController