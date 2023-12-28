const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../ulti/mongoose')
require('dotenv').config()

class AccountController {

    //[GET] /account/view?role=&page=
    view(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0

        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            
            if (userRole == 0) {
                const roleFilter = req.query.role ? (isNaN(parseInt(req.query.role)) ? [1, 2] : 
                                    (parseInt(req.query.role) <= 2 && parseInt(req.query.role) >=1 ? [parseInt(req.query.role)] : [1, 2])) : [1, 2]

                Actors.find({role: {$in: roleFilter}})
                    .sort({_id: -1})
                    .skip((page * pageSize))
                    .limit(pageSize)
                    .then(actors => {
                        res.status(200).json({
                            accounts: multipleMongooseToObject(actors)
                        })
                    })
            } else if (userRole == 1 || userRole == 2){
                var userBaseID = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).workAt
                Actors.find({role: [3, 4], workAt: userBaseID})
                    .skip((page * pageSize))
                    .limit(pageSize)
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
        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
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
        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            if (userRole == 0 || userRole == 1 || userRole == 2) {
                if (req.body.accountData) {
                    var accountData = req.body.accountData
                    try {
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
                                                .catch(err => {
                                                    console.log(err)
                                                    res.status(400).json("Data invalid")
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            res.status(400).json("Data invalid")
                                        })
                                } else {
                                    var userBaseID = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).workAt
                                    accountData.role = userRole == 1 ? 3 : 4
                                    accountData.workAt = userBaseID
                                    const account = new Actors(accountData)
                                    account.save()
                                        .then(() => {
                                            Bases.updateOne({_id: accountData.workAt}, {$push: {StaffIDs: account._id}})
                                                .then(() => {
                                                    res.status(200).json('Create Account Successfully')
                                                })
                                                .catch(err => {
                                                    console.log(err)
                                                    res.status(400).json("Data invalid")
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            res.status(400).json("Data invalid")
                                        })
                                }
                            }
                        })
                    } catch (err) {
                        console.log(err)
                        res.status(400).json("Bad Request")
                    }
                } else {
                    res.status(400).json("Account Data Empty")
                }
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[GET] /account/edit?id=
    editAccount(req, res, next) {
        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            if (userRole == 0 || userRole == 1 || userRole == 2) {
                if (req.query.id) {
                    Actors.findById(req.query.id)
                    .then(actor => {
                        res.status(200).json({
                            account: mongooseToObject(actor)
                        })
                    })
                } else {
                    res.status(404).json("Must specify account id")
                }
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[PUT] /account/edit?id=
    updateAccount(req, res, next) {
        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            if (userRole == 0 || userRole == 1 || userRole == 2) {
                if (req.query.id) {
                    if (userRole == 0) {
                        Actors.updateOne({_id: req.query.id}, req.body.accountData)
                            .then(() => {
                                Bases.updateOne({managerID: req.query.id}, {$unset: {managerID: ""}})
                                    .then(() => {
                                        Bases.updateOne({_id: req.body.accountData.workAt}, {$set: {managerID: req.query.id}})
                                            .then(() => {
                                                res.status(200).json('Updated account successfully')
                                            })
                                            .catch(err => {
                                                console.log(err)
                                                res.status(400).json("Data invalid")
                                            })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        res.status(400).json("Data invalid")
                                    })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json("Data invalid")
                            })
                    } else {
                        Actors.updateOne(
                            {_id: req.query.id}, 
                            {$set: {name: req.body.accountData.name, username: req.body.accountData.username, password: req.body.accountData.password}})
                            .then(() => {
                                res.status(200).json('Updated account successfully')
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json("Data invalid")
                            })
                    }
                } else {
                    res.status(404).json("Must specify account id")
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
        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            if (userRole == 0 || userRole == 1 || userRole == 2) {
                if (! req.body.accountIDs) {
                    res.status(400).json("Must specify account id")
                } else {
                    Actors.deleteMany({_id: {$in: req.body.accountIDs}})
                        .then(() => {
                            if (userRole == 0) {
                                Bases.updateMany({managerID: {$in: req.body.accountIDs}}, {$unset: {managerID: ""}})
                                    .then(() => {
                                        res.status(200).json({message: 'Delete Accounts Successfully'})
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        res.status(400).json("Data invalid")
                                    })
                            } else {
                                var userBaseID = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).workAt
                                Bases.updateOne({_id: userBaseID}, {$pull: {StaffIDs: {$in: req.body.accountIDs}}})
                                .then(() => {
                                    res.status(200).json({message: 'Delete Account Successfully'})
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.status(400).json("Data invalid")
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(400).json("Data invalid")
                        })
                }
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }
}

module.exports = new AccountController