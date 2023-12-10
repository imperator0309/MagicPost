const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
require('dotenv').config()

class DirectorController {
    //[GET] /director/accounts
    showAccounts(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Actors.find({role: [1, 2]})
                    .then(actors => {
                        res.status(200).json({
                            accounts: multipleMongooseToObject(actors)
                        })
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[POST] /director/accounts/create
    createAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                var accountData = req.body
                Actors.findOne({username: accountData.username})
                    .then(actor => {
                        if (actor) {
                            res.status(409).json({message: 'username existed'})
                        } else {
                            const account = new Actors(accountData)
                            account.save()
                                .then(() => {
                                    Bases.updateOne({_id: accountData.workAt}, {$set: {managerID: account._id}})   
                                        .then(() => {
                                            res.status(200).json({message: 'Create Account Successfully'})
                                        })
                                })
                        }
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[GET] /director/accounts/edit
    editAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Actors.findById(req.query.accountID)
                    .then(actor => {
                        console.log(req.query.accountID)
                        res.status(200).json({
                            account: mongooseToObject(actor)
                        })
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[PUT] /director/accounts/edit
    updateAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Actors.updateOne({_id: req.query.accountID}, req.body)
                    .then(() => {
                        Bases.updateOne({managerID: req.query.accountID}, {$unset: {managerID: ""}})
                            .then(() => {
                                Bases.updateOne({_id: req.body.workAt}, {$set: {managerID: req.query.accountID}})
                                    .then(() => {
                                        res.status(200).json({message: 'Updated account successfully'})
                                    })
                            })
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[DELETE] /director/accounts/delete
    deleteAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Actors.deleteMany({_id: {$in: req.body.accountIDs}})
                    .then(() => {
                        Bases.updateMany({managerID: {$in: req.body.accountIDs}}, {$unset: {managerID: ""}})
                            .then(() => {
                                res.status(200).json({message: 'Delete Accounts Successfully'})
                            })
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[GET] /director/bases
    showBases(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Bases.find({})
                    .then(bases => {
                        res.status(200).json({
                            bases: multipleMongooseToObject(bases)
                        })
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[POST] /director/bases/create
    createBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                var baseData = req.body
                if (baseData.baseType == 1) {
                    Bases.findOne({baseLocation: baseData.superiorBase})
                        .then(superior => {
                            baseData.superiorBase = superior._id
                            const base = new Bases(baseData)
                            base.save()
                                .then(res.status(200).json({message: 'Create Base Successfully'}))
                            })
                } else {
                    const base = new Bases(baseData)
                    base.save()
                        .then(res.status(200).json({message: 'Create Base Successfully'}))
                }
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[DELETE] /director/bases/delete
    deleteBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Actors.deleteMany({_id: {$in: req.body.baseIDs}})
                    .then(() => {
                        Actors.updateMany({workAt: {$in: req.body.baseIDs}}, {$unset: {workAt: ""}})
                            .then(() => {
                                res.status(200).json({message: 'Delete Bases Successfully'})
                            })
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }
}

module.exports = new DirectorController