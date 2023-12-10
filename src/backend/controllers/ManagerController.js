const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')

class ManagerController {
    //[GET] /director
    showHomePage(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var userID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userID
            if (userRole == 1 || 2) {
                
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[GET] /manager/accounts
    showAccounts(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 1 || userRole == 2) {
                Actors.find({role: [3, 4], workAt: userBaseID})
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

    //[POST] /manager/accounts/create
    createAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 1 || userRole == 2) {
                var accountData = req.body
                accountData.role = userRole == 1 ? 3 : 4
                Actors.findOne({username: accountData.username})
                    .then(actor => {
                        if (actor) {
                            res.status(409).json({message: 'username existed'})
                        } else {
                            const account = new Actors(accountData)
                            account.save()
                                .then(() => {
                                    Bases.updateOne({_id: accountData.workAt}, {$push: {StaffIDs: account._id}})
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

    //[GET] /manager/accounts/edit
    editAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 1 || userRole == 2) {
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

    //[PUT] /manager/accounts/edit
    updateAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 1 || userRole == 2) {
                Actors.updateOne(
                    {_id: req.query.accountID}, 
                    {$set: {name: req.body.name, username: req.body.username, password: req.body.password}})
                    .then(() => {
                        res.status(200).json({message: 'Updated account successfully'})
                    })

            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[DELETE] /manager/accounts/delete
    deleteAccount(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 1 || userRole == 2) {
                Actors.deleteMany({_id: {$in: req.body.accountIDs}})
                    .then(() => {
                        Bases.updateOne({_id: userBaseID}, {$pull: {StaffIDs: {$in: req.body.accountIDs}}})
                            .then(() => {
                                res.status(200).json({message: 'Delete Account Successfully'})
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

module.exports = new ManagerController