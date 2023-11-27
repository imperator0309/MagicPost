const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const {addSecret, removeSecret, getSecret} = require('../ulti/mappingSecret')
const { json } = require('express')

class DirectorController {

    //[GET] /director/accounts
    showAccounts(req, res, next) {
        Actors.find({role: [1, 2]})
            .then(actors => {
                res.json({
                    querySuccess: 'true',
                    accounts: multipleMongooseToObject(actors)
                })
            })
    }

    //[POST] /director/accounts/create
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

    //[GET] /director/accounts/edit/:accountID
    editAccount(req, res, next) {
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
                        Actors.findById(req.params.accountID)
                            .then(actor => {
                                actor = mongooseToObject(actor)
                                actor.querySuccess = 'true'
                                res.json({
                                    querySuccess: 'true',
                                    account: actor
                                })
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[PUT] /director/accounts/edit/:id
    updateAccount(req, res, next) {
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
                        Actors.updateOne({_id: req.params.accountID}, req.body)
                            .then(() => {
                                res.json({querySuccess: 'true', message: 'Updated account successfully'})
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[DELETE] /director/accounts/delete
    deleteAccount(req, res, next) {
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
                        Actors.deleteOne({_id: req.body.accountID})
                            .then(() => {
                                res.json({querySuccess: 'true', message: 'Delete Account Successfully'})
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[DELETE] /director/accounts/multiple-delete
    deleteMultipleAccounts(req, res, next) {
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
                        Actors.deleteMany({_id: {$in: req.body.accountIDs}})
                            .then(() => {
                                res.json({querySuccess: 'true', message: 'Delete Accounts Successfully'})
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[GET] /director/bases
    showBases(req, res, next) {
        Bases.find({})
            .then(bases => {
                res.json({
                    querySuccess: 'true',
                    bases: multipleMongooseToObject(bases)
                })
            })
    }

    //[POST] /director/bases/create
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

    //[GET] /director/bases/edit/:id
    editBase(req, res, next) {
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
                        Bases.findById(req.params.baseID)
                            .then(base => {
                                base = mongooseToObject(base)
                                base.querySuccess = 'true'
                                res.json({
                                    querySuccess: 'true',
                                    base: base
                                })
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[PUT] /director/bases/edit/:id
    updateBase(req, res, next) {
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
                        Bases.updateOne({_id: req.params.baseID}, req.body)
                            .then(() => {
                                res.json({querySuccess: 'true', message: 'Updated Base Successfully'})
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[DELETE] /director/bases/delete
    deleteBase(req, res, next) {
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
                        Bases.deleteOne({_id: req.body.baseID})
                            .then(() => {
                                res.json({querySuccess: 'true', message: 'Delete Base Successfully'})
                            })
                    } else {
                        res.json({querySuccess: 'false', message: 'Permission Denied'})
                    }
                })
        } else {
            res.json({querySuccess: 'false', message: 'Permission Denied'})
        }
    }

    //[DELETE] /director/bases/multiple-delete
    deleteMultipleBases(req, res, next) {
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
                        Actors.deleteMany({_id: {$in: req.body.baseIDs}})
                            .then(() => {
                                res.json({querySuccess: 'true', message: 'Delete Bases Successfully'})
                            })
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