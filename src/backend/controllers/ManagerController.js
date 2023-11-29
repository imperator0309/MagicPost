const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const {addSecret, removeSecret, getSecret} = require('../ulti/mappingSecret')

class ManagerController {

    //[GET] /manager/accounts
    showAccounts(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(manager => {
                    var querySuccess = false
                    if (manager) {
                        if (manager.role == 1 || manager.role == 2) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        Actors.find({role: [3, 4], workAt: manager.workAt})
                            .then(actors => {
                                res.json({
                                    querySuccess: 'true',
                                    accounts: multipleMongooseToObject(actors)
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

    //[POST] /manager/accounts/create
    createAccount(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(manager => {
                    var querySuccess = false
                    if (manager) {
                        if (manager.role == 1 || manager.role == 2) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        var accountData = req.body
                        accountData.workAt = manager.workAt
                        accountData.role = manager.role == 1 ? 3 : 4
                        Actors.findOne({username: accountData.username})
                            .then(actor => {
                                if (actor) {
                                    res.json({querySuccess: 'false', message: 'username existed'})
                                } else {
                                    const account = new Actors(accountData)
                                    account.save()
                                        .then(() => {
                                            Bases.updateOne({_id: accountData.workAt}, {$push: {StaffIDs: account._id}})
                                                .then(() => {
                                                    res.json({querySuccess: 'true', message: 'Create Account Successfully'})
                                                })
                                        })
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

    //[GET] /manager/accounts/edit
    editAccount(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(manager => {
                    var querySuccess = false
                    if (manager) {
                        if (manager.role == 1 || manager.role == 2) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        Actors.findById(req.query.accountID)
                            .then(actor => {
                                console.log(req.query.accountID)
                                res.json({
                                    querySuccess: 'true',
                                    account: mongooseToObject(actor)
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

    //[PUT] /manager/accounts/edit
    updateAccount(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(manager => {
                    var querySuccess = false
                    if (manager) {
                        if (manager.role == 1 || manager.role == 2) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        Actors.updateOne(
                            {_id: req.query.accountID}, 
                            {$set: {name: req.body.name, username: req.body.username, password: req.body.password}})
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

    //[DELETE] /manager/accounts/delete
    deleteAccount(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(manager => {
                    var querySuccess = false
                    if (manager) {
                        if (manager.role == 1 || manager.role == 2) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        Actors.deleteOne({_id: req.body.accountID})
                            .then(() => {
                                Bases.updateOne({_id: manager.workAt}, {$pull: {StaffIDs: req.body.accountID}})
                                    .then(() => {
                                        res.json({querySuccess: 'true', message: 'Delete Account Successfully'})
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

    //[DELETE] /manager/accounts/multiple-delete
    deleteMultipleAccounts(req, res, next) {
        if (req.cookies.id) {
            var userID = jwt.verify(req.cookies.id, 'secret').userID
            Actors.findById(userID)
                .then(manager => {
                    var querySuccess = false
                    if (manager) {
                        if (manager.role == 1 || manager.role == 2) {
                            querySuccess = true
                        }
                    }

                    if (querySuccess) {
                        Actors.deleteMany({_id: {$in: req.body.accountIDs}})
                            .then(() => {
                                Bases.updateOne({_id: manager.workAt}, {$pull: {StaffIDs: {$in: req.body.accountIDs}}})
                                    .then(() => {
                                        res.json({querySuccess: 'true', message: 'Delete Account Successfully'})
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
}

module.exports = new ManagerController