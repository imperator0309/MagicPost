const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const {addSecret, removeSecret, getSecret} = require('../ulti/mappingSecret')

class DirectorController {
    //[POST] /director/create-account
    createAccount(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(director => {
                    var querySuccess = false
                    if (director) {
                        if (director.role == 0) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        var accountData = req.body
                        Actors.findOne({username: accountData.username})
                            .then(actor => {
                                if (actor) {
                                    res.json({querySuccess: 'false', message: 'username existed'})
                                } else {
                                    const actor = new Actors(accountData)
                                    actor.save()

                                    Bases.updateOne({_id: accountData.workAt}, {$set: {managerID: actor._id}})   
                                        .then(res.json({querySuccess: 'true', message: 'Create Account Successfully'}))
                                }
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[POST] /director/create-base
    createBase(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(director => {
                    var querySuccess = false
                    if (director) {
                        if (director.role == 0) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        var baseData = req.body
                        if (baseData.baseType == 1) {
                            Bases.findOne({baseLocation: baseData.superiorBase})
                                .then(superior => {
                                    baseData.superiorBase = superior._id
                                    const base = new Bases(baseData)
                                    base.save()
                                        .then(res.json({querySuccess: 'true', message: 'Create Base Successfully'}))
                                    })
                        } else {
                            const base = new Bases(baseData)
                            base.save()
                                .then(res.json({querySuccess: 'true', message: 'Create Base Successfully'}))
                        }
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }
}

module.exports = new DirectorController