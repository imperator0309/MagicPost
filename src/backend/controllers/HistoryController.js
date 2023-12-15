const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')

class HistoryController {

    //[GET] /parcel/history/general?status=?&start=?&end=?&page=
    showHistory(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 0
        page = isNaN(page) ? 0 : page
        page = page < 0 ? 0 : page
        var start = req.query.start ? req.query.start : "2000-01-01"
        var end = req.query.end ? req.query.end : "3000-12-31"
        var statusFilter = req.query.status ? [parseInt(req.query.status)] : [0, 1, 2, 3, 4]

        start = isNaN(new Date(start)) ? new Date("2000-01-01").toJSON() : new Date(start).toJSON()
        end = isNaN(new Date(end)) ? new Date("3000-12-31").toJSON() : new Date(end).toJSON()

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 3 || userRole == 4) {
                Parcels.aggregate([
                    {
                        $unwind: "$passedBases"
                    },
                    {
                        $match: {
                            "passedBases.id": workingBaseID,
                            "passedBases.timestamp": {
                                $gte: start,
                                $lte: end
                            },
                            status: {$in: statusFilter}
                        }
                    },
                    {
                        $sort: {"passedBases.timestamp": -1}
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
                        history: parcels
                    })
                })
            } else {
                res.status(403).json("Permission denied")
            }
        } else {
            res.status(401).json("Permission denied")
        }
    }

    //[GET] /parcel/history/to-receiver??status=?&start=?&end=?&page=
    showToReceiverHistory(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 0
        page = isNaN(page) ? 0 : page
        page = page < 0 ? 0 : page

        var start = req.query.start ? req.query.start : "2000-01-01"
        var end = req.query.end ? req.query.end : "3000-12-31"
        var statusFilter = req.query.status ? [parseInt(req.query.status)] : [0, 1, 2, 3, 4]

        start = isNaN(new Date(start)) ? new Date("2000-01-01").toJSON() : new Date(start).toJSON()
        end = isNaN(new Date(end)) ? new Date("3000-12-31").toJSON() : new Date(end).toJSON()

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $arrayElemAt: ["$passedBases.id", -1] }, workingBaseID] }, 
                                { $gte: [{ $arrayElemAt: ["$passedBases.timestamp", -1] }, start] },
                                { $lte: [{ $arrayElemAt: ["$passedBases.timestamp", -1] }, end] },
                                { $in: ["$status", statusFilter] }
                            ]
                        }
                    }
                },
                {
                    $sort: {finishedDate: -1}
                },
                {
                    $skip: page * pageSize
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

    //[GET] /parcel/history/from-receiver??status=?&start=?&end=?&page=
    showFromReceiverHistory(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 0
        page = isNaN(page) ? 0 : page
        page = page < 0 ? 0 : page

        var start = req.query.start ? req.query.start : "2000-01-01"
        var end = req.query.end ? req.query.end : "3000-12-31"
        var statusFilter = req.query.status ? [parseInt(req.query.status)] : [0, 1, 2, 3, 4]

        start = isNaN(new Date(start)) ? new Date("2000-01-01").toJSON() : new Date(start).toJSON()
        end = isNaN(new Date(end)) ? new Date("3000-12-31").toJSON() : new Date(end).toJSON()

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 4) {
                Parcels.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $arrayElemAt: ["$passedBases.id", 0] }, workingBaseID] }, 
                                { $gte: [{ $arrayElemAt: ["$passedBases.timestamp", 0] }, start] },
                                { $lte: [{ $arrayElemAt: ["$passedBases.timestamp", 0] }, end] },
                                { $in: ["$status", statusFilter] }
                            ]
                        }
                    }
                },
                {
                    $sort: {finishedDate: -1}
                },
                {
                    $skip: page * pageSize
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
}

module.exports = new HistoryController