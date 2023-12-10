const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../ulti/mongoose')
require('dotenv').config()

class AccountController {

    //[GET] /account/view
    view(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Actors.find({role: [1, 2]})
                    .then(actors => {
                        res.status(200).json({
                            accounts: multipleMongooseToObject(actors)
                        })
                    })
            } else if (userRole == 1 || userRole == 2){
                var userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                Actors.find({role: [3, 4], workAt: userBaseID})
                    .then(actors => {
                        res.status(200).json({
                            accounts: multipleMongooseToObject(actors)
                        })
                    })
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[GET] /account/create
    showCreateAccountPage(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                const transactionBases = Bases.find({baseType: 1})
                const distributionBases = Bases.find({baseType: 0})

                Promise.all([distributionBases, transactionBases])
                    .then(([distributionBases, transactionBases]) => {
                        res.status(200).json({
                            distributionBases: multipleMongooseToObject(distributionBases),
                            transactionBases: multipleMongooseToObject(transactionBases)
                        })
                    })
            } else if (userRole == 1 || userRole == 2){
                res.status(200).json("Access successfully")
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[POST] /account/create
    createAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                var accountData = req.body
                Actors.findOne({username: accountData.username})
                    .then(actor => {
                        if (actor) {
                            res.status(409).json('username existed')
                        } else {
                            if (userRole == 0) {
                                const account = new Actors(accountData)
                                account.save()
                                    .then(() => {
                                        Bases.updateOne({_id: accountData.workAt}, {$set: {managerID: account._id}})   
                                            .then(() => {
                                                res.status(200).json('Create Account Successfully')
                                            })
                                    })
                            } else {
                                var userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                                accountData.workAt = userBaseID
                                const account = new Actors(accountData)
                                account.save()
                                    .then(() => {
                                        Bases.updateOne({_id: accountData.workAt}, {$push: {StaffIDs: account._id}})
                                            .then(() => {
                                                res.status(200).json('Create Account Successfully')
                                            })
                                    })
                            }
                        }
                    })
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[GET] /account/edit
    editAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0 || userRole == 1 || userRole == 2) {
                Actors.findById(req.query.accountID)
                    .then(actor => {
                        console.log(req.query.accountID)
                        res.status(200).json({
                            account: mongooseToObject(actor)
                        })
                    })
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[PUT] /account/edit
    updateAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0 || userRole == 1 || userRole == 2) {
                if (userRole == 0) {
                    Actors.updateOne({_id: req.query.accountID}, req.body)
                        .then(() => {
                            Bases.updateOne({managerID: req.query.accountID}, {$unset: {managerID: ""}})
                                .then(() => {
                                    Bases.updateOne({_id: req.body.workAt}, {$set: {managerID: req.query.accountID}})
                                        .then(() => {
                                            res.status(200).json('Updated account successfully')
                                        })
                                })
                        })
                } else {
                    Actors.updateOne(
                        {_id: req.query.accountID}, 
                        {$set: {name: req.body.name, username: req.body.username, password: req.body.password}})
                        .then(() => {
                            res.status(200).json('Updated account successfully')
                        })
                }
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[DELETE] /account/delete
    deleteAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0 || userRole == 1 || userRole == 2) {
                Actors.deleteMany({_id: {$in: req.body.accountIDs}})
                    .then(() => {
                        if (userRole == 0) {
                            Bases.updateMany({managerID: {$in: req.body.accountIDs}}, {$unset: {managerID: ""}})
                                .then(() => {
                                    res.status(200).json({message: 'Delete Accounts Successfully'})
                                })
                        } else {
                            var userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                            Bases.updateOne({_id: userBaseID}, {$pull: {StaffIDs: {$in: req.body.accountIDs}}})
                            .then(() => {
                                res.status(200).json({message: 'Delete Account Successfully'})
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
}

module.exports = new AccountController