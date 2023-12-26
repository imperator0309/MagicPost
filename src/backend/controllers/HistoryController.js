const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')

class HistoryController {

    //[GET] /parcel/history/general?status=?&start=?&end=?&page=&sort=?
    showHistory(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0
        const sort = req.query.sort ? (req.query.sort == 'asc' ? 1 : -1) : -1

        const start = (req.query.start ? (isNaN(new Date(req.query.start)) ? new Date("2000-01-01") : new Date(req.query.start)) : new Date("2000-01-01")).toJSON()
        const end = (req.query.end ? (isNaN(new Date(req.query.end)) ? new Date("3000-12-31") : new Date(req.query.end)) : new Date("3000-12-31")).toJSON()
        const statusFilter = req.query.status ? [parseInt(req.query.status)] : [0, 1, 2, 3, 4]

        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).workAt
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
                        $sort: {"passedBases.timestamp": sort}
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
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0
        const sort = req.query.sort ? (req.query.sort == 'asc' ? 1 : -1) : -1

        const start = (req.query.start ? (isNaN(new Date(req.query.start)) ? new Date("2000-01-01") : new Date(req.query.start)) : new Date("2000-01-01")).toJSON()
        const end = (req.query.end ? (isNaN(new Date(req.query.end)) ? new Date("3000-12-31") : new Date(req.query.end)) : new Date("3000-12-31")).toJSON()
        const statusFilter = req.query.status ? [parseInt(req.query.status)] : [0, 1, 2, 3, 4]

        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).workAt
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
                    $sort: {finishedDate: sort}
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
        const page = req.query.page ? (isNaN(parseInt(req.query.page)) ? 0 : (parseInt(req.query.page) < 0 ? 0 : parseInt(req.query.page))) : 0
        const sort = req.query.sort ? (req.query.sort == 'asc' ? 1 : -1) : -1

        const start = (req.query.start ? (isNaN(new Date(req.query.start)) ? new Date("2000-01-01") : new Date(req.query.start)) : new Date("2000-01-01")).toJSON()
        const end = (req.query.end ? (isNaN(new Date(req.query.end)) ? new Date("3000-12-31") : new Date(req.query.end)) : new Date("3000-12-31")).toJSON()
        const statusFilter = req.query.status ? [parseInt(req.query.status)] : [0, 1, 2, 3, 4]

        if (req.get("Authorization")) {
            var userRole = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).userRole
            var workingBaseID = jwt.verify(req.get("Authorization"), process.env.TOKEN_KEY).workAt
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
                    $sort: {finishedDate: sort}
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