const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../ulti/mongoose')
require('dotenv').config()

class ParcelController {

    //[POST] /parcel/create
    createParcel(req, res, next) {
        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Bases.findById(workingBaseID)
                    .then(base => {
                        var passedBase = {
                            id: workingBaseID,
                            baseLocation: base.baseLocation,
                            timestamp: (new Date()).toJSON()
                        }
                        var parcelData = req.body.parcelData
                        parcelData.status = 0
                        parcelData.orderDate = (new Date()).toJSON()
                        parcelData.passedBases = [passedBase]
                        const newParcel = new Parcels(parcelData)
                        newParcel.save()
                            .then(() => {
                                res.status(200).json("Create new parcel successfully")
                            })
                            .catch(err => {
                                res.status(500).json("Data invalid")
                            })
                        })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/incoming/from-distribution-base?page=?
    showIncomingFromDistributionBase(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0

        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3 || userRole == 4) {
                Parcels.find({status: 1, nextBase: workingBaseID, passedBases: {$not: {$size: 1}}})
                    .sort({_id: -1})
                    .skip((page * pageSize))
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

    //[GET] /parcel/incoming/from-transaction-base?page=
    showIncomingFromTransactionBase(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0

        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3) {
                Parcels.find({status: 1, nextBase: workingBaseID, passedBases: {$size: 1}})
                    .sort({_id: -1})
                    .skip((page * pageSize))
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

    //[PUT] /parcel/incoming
    confirmIncomingParcels(req, res, next) {
        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4 || userRole == 3) {
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
                            .catch(err => {
                                res.status(500).json("Data invalid")
                            })
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/to-distribution-base?page=?
    showToDistributionBase(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0

        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3 || userRole == 4) {
                const statusFilter = userRole == 3 ? 1 : 0
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
                            status: statusFilter
                        }
                    ]
                })
                .sort({_id: -1})
                .skip((page * pageSize))
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

    //[PUT] /parcel/to-distribution-base
    forwardToDistributionBase(req, res, next) { 
        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Bases.findById(workingBaseID)
                    .then(workingBase => {                        
                        Parcels.updateMany({_id: {$in: req.body.parcelIDs}},
                            {
                                $set: {
                                    nextBase: workingBase.superiorBase,
                                    "passedBases.$[element].leave": (new Date()).toJSON(),
                                    status: 1
                                },
                            },
                            {
                                arrayFilters: [{"element": {$exists: true}}]
                            })
                            .then(() => {
                                res.status(200).json("Create forwarding successfully")
                            })
                            .catch(err => {
                                res.status(500).json("Data invalid")
                            })
                    })
            } else if (userRole == 3) {
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
                    .catch(err => {
                        res.status(500).json("Data invalid")
                    })
            }  else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/to-transaction-base?page=
    showToTransactionBase(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0

        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
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
                .skip((page * pageSize))
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

    //[PUT] /parcel/to-transaction-base
    forwardToTransactionBase(req, res, next) {
        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
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
                    .catch(err => {
                        res.status(500).json("Data invalid")
                    })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/to-receiver/in-queue?page=
    showToReceiver(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0

        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
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
                        $skip: page * pageSize
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

    //[PUT] /parcel/to-receiver/in-queue
    forwardToReceiver(req, res, next) {
        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
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
                        .catch(err => {
                            res.status(500).json("Data invalid")
                        })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/to-receiver/delivering?page=
    showToReceiverDelivering(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0

        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
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
                        $sort: {_id: -1}
                    },
                    {
                        $skip: page * pageSize
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

    //[PUT] /parcel/to-receiver/delivering
    confirmToReceiver(req, res, next) {
        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 4) {
                if (req.body.status == 3) {
                    var receivedDate = (new Date()).toJSON()
                    Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {status: req.body.status, finishedDate: receivedDate}})
                        .then(() => {
                            res.status(200).json("Confirmed parcels successfully")
                        })
                        .catch(err => {
                            res.status(500).json("Data invalid")
                        })

                } else if (req.body.status == 4) {
                    var canceledDate = (new Date()).toJSON()
                    Parcels.updateMany({_id: {$in: req.body.parcelIDs}}, {$set: {status: req.body.status, finishedDate: canceledDate}})
                        .then(() => {
                            res.status(200).json("Confirmed parcels successfully")
                        })
                        .catch(err => {
                            res.status(500).json("Data invalid")
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
}

module.exports = new ParcelController