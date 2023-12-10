const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../ulti/mongoose')
require('dotenv').config()

class EmployeeController {
    
    //[POST] /parcel/transaction-base/create
    createParcel(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Bases.findById(workingBaseID)
                    .then(base => {
                        var passedBase = {
                            id: base._id,
                            baseLocation: base.baseLocation,
                            timestamp: (new Date()).toISOString()
                        }
                        var parcelData = req.body
                        parcelData.status = 0
                        parcelData.orderDate = (new Date(parcelData.orderDate)).toISOString()
                        parcelData.passedBases = [passedBase]
                        const newParcel = new Parcels(parcelData)
                        newParcel.save()
                            .then(() => {
                                res.status(200).json("Create new parcel successfully")
                            })
                        })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/transaction-base/to-distribution-base/in-queue
    showToDistributionBaseInQueue(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.find({status: 0, passedBases: {$size: 1, $elemMatch: {id: workingBaseID}}})
                    .then(parcels => {
                        res.status(200).json({
                            parcels: multipleMongooseToObject(parcels)
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[PUT] /parcel/transaction-base/to-distribution-base
    forwardToDistributionBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Bases.findById(workingBaseID)
                    .then(workingBase => {
                        Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {nextBase: workingBase.superiorBase, status: 1}})
                            .then(() => {
                                res.status(200).json("Create forwarding successfully")
                            })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/transaction-base/to-distribution-base/history
    showToDistributionBaseHistory(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $gt: [
                                            "$status", 0
                                        ]
                                    },
                                    {
                                        $eq: [
                                            {$arrayElemAt: ["$passedBases.id", 0]},
                                            workingBaseID
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ])
                    .then(parcels => {
                        res.status(200).json({
                            parcels: parcels
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/transaction-base/incoming
    showIncoming(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.find({status: 1, nextBase: workingBaseID})
                    .then(parcels => {
                        res.status(200).json({
                            parcels: multipleMongooseToObject(parcels)
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[PUT] /parcel/transaction-base/incoming
    confirmIncoming(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Bases.findById(workingBaseID)
                    .then(base => {
                        passedBase = {
                            id: workingBaseID,
                            baseLocation: base.baseLocation,
                            timestamp: (new Date()).toISOString()
                        }
                        Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$push: {passedBases: passedBase}, $unset: {nextBase: ""}})
                            .then(() => {
                                res.status(200).json("Confirmed incoming parcels successfully")
                            })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/transaction-base/to-receiver/in-queue
    showToReceiverInQueue(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$status", 1
                                        ]
                                    },
                                    {
                                        $eq: [
                                            {$arrayElemAt: ["$passedBases.id", -1]},
                                            workingBaseID
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ])
                    .then(parcels => {
                        res.status(200).json({
                            parcels: parcels
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[PUT] /parcel/transaction-base/to-receiver/in-queue
    forwardToReceiver(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {status: 2}})
                        .then(() => {
                            res.status(200).json("Create Parcels sent to receiver successfully")
                        })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/transaction-base/to-receiver/delivering
    showToReceiverDelivering(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                        "$status", 2
                                        ]
                                    },
                                    {
                                        $eq: [
                                            {$arrayElemAt: ["$passedBases.id", -1]},
                                            workingBaseID
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ])
                    .then(parcels => {
                        res.status(200).json({
                            parcels: parcels
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[PUT] /parcel/transaction-base/to-receiver/delivering
    confirmToReceiverStatus(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                if (req.body.status == 3) {
                    var receivedDate = (new Date(req.body.receivedDate)).toISOString()
                    Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {status: req.body.status, finishedDate: receivedDate}})
                        .then(() => {
                            res.status(200).json("Confirmed parcels successfully")
                        })

                } else if (req.body.status == 4) {
                    var canceledDate = (new Date(req.body.canceledDate)).toISOString()
                    Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {status: req.body.status, finishedDate: canceledDate}})
                        .then(() => {
                            res.status(200).json("Confirmed parcels successfully")
                        })
                } else {
                    res.status(400).json("Invalid Status")
                }
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/transaction-base/to-receiver/history
    showToReceiverHistory(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {

                Parcels.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $gt: [
                                    "$status", 2
                                    ]
                                },
                                {
                                    $eq: [
                                        {$arrayElemAt: ["$passedBases.id", -1]},
                                        workingBaseID
                                    ]
                                }
                            ]
                        }
                    }
                }
            ])
                .then(history => {
                    res.status(200).json({
                        history: history
                    })
                })

            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    /*
    [Concentration Base Staff Section]
    */

    //[GET] /parcel/distribution-base/incoming/transaction-base
    showTransactionBaseIncoming(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Parcels.find({status: 1, nextBase: workingBaseID, passedBases: {$size: 1}})
                    .then(parcels => {
                        res.status(200).json({
                            parcels: multipleMongooseToObject(parcels)
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[PUT] /parcel/distribution-base/incoming/transaction-base
    confirmTransactionBaseIncoming(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Bases.findById(workingBaseID)
                    .then(workingBase => {
                        const passedBase = {
                            id: workingBase,
                            baseLocation: workingBase.baseLocation,
                            timestamp: (new Date()).toISOString()
                        }

                        Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$push: {passedBases: passedBase}, $unset: {nextBase: ""}})
                            .then(() => {
                                res.status(200).json("Confirm incoming parcel successfully")
                            })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/distribution-base/incoming/distribution-base
    showDistributionBaseIncoming(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Parcels.find({status: 1, nextBase: workingBaseID, passedBases: {$not: {$size: 1}}})
                    .then(parcels => {
                        res.status(200).json({
                            parcels: multipleMongooseToObject(parcels)
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[PUT] /parcel/distribution-base/incoming/distribution-base
    confirmDistributionBaseIncoming(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Bases.findById(workingBaseID)
                    .then(workingBase => {
                        const passedBase = {
                            id: workingBase,
                            baseLocation: workingBase.baseLocation,
                            timestamp: (new Date()).toISOString()
                        }

                        Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$push: {passedBases: passedBase}, $unset: {nextBase: ""}})
                            .then(() => {
                                res.status(200).json("Confirm incoming parcel successfully")
                            })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/distribution-base/to-receiver/in-queue
    showToTransactionBaseInQueue(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                const incomingParcels = Parcels.find({status: 1, nextBase: workingBaseID, passedBases: {$not: {$size: 1}}})
                const basesList = Bases.find({superiorBase: workingBaseID})
                Promise.all([incomingParcels, basesList])
                    .then(([parcels, bases]) => {
                        res.status(200).json({
                            parcels: multipleMongooseToObject(parcels),
                            bases: multipleMongooseToObject(bases)
                        })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[PUT] /parcel/distribution-base/to-receiver/in-queue
    forwardToTransactionBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {nextBase: req.body.nextBase}})
                    .then(() => {
                        res.status(200).json("Sent to transaction base successfully")
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }
}

module.exports = new EmployeeController