const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../ulti/mongoose')
require('dotenv').config()

class ParcelController {
    
    //[POST] /parcel/transaction-base/create
    createParcel(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Bases.findById(workingBaseID)
                    .then(base => {
                        var passedBase = {
                            id: workingBaseID,
                            baseLocation: base.baseLocation,
                            timestamp: (new Date()).toJSON()
                        }
                        var parcelData = req.body
                        parcelData.status = 0
                        parcelData.orderDate = (new Date()).toJSON()
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

    //[GET] /parcel/transaction-base/to-distribution-base/in-queue?page=
    showToDistributionBaseInQueue(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.find({status: 0, passedBases: {$size: 1, $elemMatch: {id: workingBaseID}}})
                    .skip(((page - 1) * pageSize))
                    .limit(pageSize)
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

    //[PUT] /parcel/transaction-base/to-distribution-base/in-queue
    forwardToDistributionBase(req, res, next) { 
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Bases.findById(workingBaseID)
                    .then(workingBase => {                        
                        Parcels.updateMany({_id: {$in: req.body.parcelIDs}},
                            {
                                $set: {
                                    nextBase: workingBase.superiorBase,
                                    status: 1,
                                    "passedBases.$[element].leave": (new Date()).toJSON()
                                },
                            },
                            {
                                arrayFilters: [{"element": {$exists: true}}]
                            })
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

    //[GET] /parcel/transaction-base/to-distribution-base/history?page=
    showToDistributionBaseHistory(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

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
                    },
                    {
                        $sort: {orderDate: -1}
                    },
                    {
                        $skip: (page - 1) * pageSize
                    },
                    {
                        $limit: pageSize
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

    //[GET] /parcel/transaction-base/incoming?page=?
    showIncoming(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.find({status: 1, nextBase: workingBaseID})
                    .sort({_id: -1})
                    .skip(((page - 1) * pageSize))
                    .limit(pageSize)
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
                        var passedBase = {
                            id: workingBaseID,
                            baseLocation: base.baseLocation,
                            timestamp: (new Date()).toJSON()
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

    //[GET] /parcel/transaction-base/to-receiver/in-queue?page=
    showToReceiverInQueue(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

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
                    },
                    {
                        $sort: {_id: -1}
                    },
                    {
                        $skip: (page - 1) * pageSize
                    },
                    {
                        $limit: pageSize
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
                Parcels.updateMany({_id: {$in: req.body.parcelIDs}},
                    {
                        $set: {status: 2, "passedBases.$[element].leave": (new Date()).toJSON()}
                    }, 
                    {
                        arrayFilters: [{"element": {$exists: true}}]
                    })
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

    //[GET] /parcel/transaction-base/to-receiver/delivering?page=
    showToReceiverDelivering(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

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
                    },
                    {
                        $skip: (page - 1) * pageSize
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
                    var receivedDate = (new Date()).toJSON()
                    Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {status: req.body.status, finishedDate: receivedDate}})
                        .then(() => {
                            res.status(200).json("Confirmed parcels successfully")
                        })

                } else if (req.body.status == 4) {
                    var canceledDate = (new Date()).toJSON()
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

    //[GET] /parcel/transaction-base/to-receiver/history?page=
    showToReceiverHistory(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

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
                },
                {
                    $sort: {finishedDate: -1}
                },
                {
                    $skip: (page - 1) * pageSize
                },
                {
                    $limit: pageSize
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

    //[GET] /parcel/distribution-base/incoming/transaction-base?page=
    showTransactionBaseIncoming(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Parcels.find({status: 1, nextBase: workingBaseID, passedBases: {$size: 1}})
                    .sort({_id: -1})
                    .skip(((page - 1) * pageSize))
                    .limit(pageSize)
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
                        workingBase = mongooseToObject(workingBase)
                        const passedBase = {
                            id: workingBaseID,
                            baseLocation: workingBase.baseLocation,
                            timestamp: (new Date()).toJSON()
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

    //[GET] /parcel/distribution-base/incoming/distribution-base?page=
    showDistributionBaseIncoming(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Parcels.find({status: 1, nextBase: workingBaseID, passedBases: {$not: {$size: 1}}})
                    .sort({_id: -1})
                    .skip(((page - 1) * pageSize))
                    .limit(pageSize)
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
                            id: workingBaseID,
                            baseLocation: workingBase.baseLocation,
                            timestamp: (new Date()).toJSON()
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

    //[GET] /parcel/distribution-base/to-transaction-base/in-queue?page=
    showToTransactionBaseInQueue(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                const incomingParcels = Parcels.find({
                    $and: [
                        {
                            $expr: {
                                $eq: [
                                    { $arrayElemAt: ["$passedBases.id", -1] },
                                    workingBaseID
                                ]
                            }
                        },
                        {
                            status: 1
                        }
                    ]
                })
                .sort({_id: -1})
                .skip(((page - 1) * pageSize))
                .limit(pageSize)

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

    //[PUT] /parcel/distribution-base/to-transaction-base/in-queue
    forwardToTransactionBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 3) {
                Parcels.updateMany({_id: {$in: req.body.parcelIDs}},
                    {
                        $set: {
                            nextBase: req.body.nextBase,
                            "passedBases.$[element].leave": (new Date()).toJSON()
                        }
                    }, 
                    {
                        arrayFilters: [{"element": {$exists: true}}]
                    })
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

    //[GET] /parcel/distribution-base/to-distribution-base/in-queue?page=?
    showToDestinedDistributionBase(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 1
        page = isNaN(page) ? 1 : page
        page = page < 1 ? 1 : page

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                const incomingParcels = Parcels.find({
                    $and: [
                        {
                            $expr: {
                                $eq: [
                                    { $arrayElemAt: ["$passedBases.id", -1] },
                                    workingBaseID
                                ]
                            }
                        },
                        {
                            status: 1
                        }
                    ]
                })
                .sort({_id: -1})
                .skip(((page - 1) * pageSize))
                .limit(pageSize)

                const basesList = Bases.find({baseType: 0, _id: {$not: {$eq: workingBaseID}}})
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

    //[PUT] /parcel/distribution-base/to-distribution-base/in-queue
    forwardToDestinedDistributionBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 3) {
                Parcels.updateMany({_id: {$in: req.body.parcelIDs}},
                    {
                        $set: {
                            nextBase: req.body.nextBase,
                            "passedBases.$[element].leave": (new Date()).toJSON()
                        }
                    }, 
                    {
                        arrayFilters: [{"element": {$exists: true}}]
                    })
                    .then(() => {
                        res.status(200).json("Sent to distribution base successfully")
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }
}

module.exports = new ParcelController