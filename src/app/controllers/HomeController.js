const Actors = require('../models/Actors')
const Parcels = require('../models/Parcels')
const {multipleMongooseToObject, mongooseToObject} = require('../../ulti/mongoose')

class HomeController {
    //GET /search
    search(req, res, next) {
        var parcelID = req.query.q
        Parcels.findById(parcelID)
            .then(parcel => {
                if (parcel) {
                    parcel = mongooseToObject(parcel)
                    parcel.queryStatus = 'success'
                    res.send(parcel.queryStatus)
                } else {
                    parcel = {queryStatus: 'failed'}
                    res.send(parcel.queryStatus)
                }
            })
            .catch(next)
    }

    //GET /login
    login(req, res, next) {
        res.render('login')
    }
    
    //GET /
    index(req, res, next) {
        
    }
}

module.exports = new HomeController