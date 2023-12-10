const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
class MyController {
    //[GET] /my/
    show(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var userID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userID
            if (userRole == 0) {
                var statistic
                this.getTotalStatistic()
                    .then((result) => {
                        statistic = result
                        total = statistic.totalParcels
                        received = statistic.receivedParcels

                        Actors.findById(userID)
                            .then(user => {
                                res.status(200).json({
                                    total: totalParcels,
                                    received: receivedParcels,
                                    name: user.name
                                })
                            })
                    })

            } else if (userRole == 1 || 2) {
                var userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                var statistic
                this.getTotalStatistic()
                    .then((result) => {
                        statistic = result
                        total = statistic.totalParcels
                        received = statistic.receivedParcels

                        const userData = Actors.findById(userID)
                        const workingBase = Bases.findById(userBaseID)

                        Promise.all([userData, workingBase])
                            .then((user, base) => {
                                res.status(200).json({
                                    total: totalParcels,
                                    received: receivedParcels,
                                    name: user.name,
                                    baseID: base._id,
                                    baseLocation: base.baseLocation
                                })
                            })                        
                    })
            } else if (userRole == 3 || 4) {
                var userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                const userData = Actors.findById(userID)
                const workingBase = Bases.findById(userBaseID)

                Promise.all([userData, workingBase])
                    .then((user, base) => {
                        res.status(200).json({
                            name: user.name,
                            baseID: base._id,
                            baseLocation: base.baseLocation
                        })
                    })
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[GET] /my/statistic?id=baseID
    showStatisticByBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                const baseID = req.body.baseID
                var statistic
                this.getStatisticByBase(baseID)
                    .then((result) => {
                        statistic = result
                        total = statistic.totalParcels
                        received = statistic.receivedParcels
                        
                        res.status(200).json({
                            total: total,
                            received: received
                        })
                    })
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    getTotalStatistic() {
        return new Promise((resolve, reject) => {
            const currentYear = (new Date()).getFullYear()

            const totalParcels = Parcels.aggregate([
                {
                    $match: {
                        passedBases: {$exist: true, $not: {$size: 0}},
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)}
                    }
                },
                {
                    $unwind: "$passedBases"
                }, 
                {
                    $match: {
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)}
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: { $toDate: "$passedBases.timestamp" } }
                            },
                            count: { $sum: 1 }
                    }
                }
            ])

            const receivedParcels = Parcels.aggregate([
                {
                    $match: {
                        passedBases: {$exist: true, $not: {$size: 0}},
                        status: 3,
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)}
                    }
                },
                {
                    $unwind: "$passedBases"
                }, 
                {
                    $match: {
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)}
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: { $toDate: "$passedBases.timestamp" } }
                            },
                            count: { $sum: 1 }
                    }
                }
            ])

            Promise.all([totalParcels, receivedParcels])
                .then((results) => {
                    const [totalParcels, receivedParcels] = results
                    const statistic = {
                        totalParcels: totalParcels,
                        receivedParcels: receivedParcels
                    }
                    resolve(statistic)
                })
        })
    }

    getStatisticByBase(baseID) {
        return new Promise((resolve, reject) => {
            const currentYear = (new Date()).getFullYear()

            const totalParcels = Parcels.aggregate([
                {
                    $match: {
                        passedBases: {$exist: true, $not: {$size: 0}},
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)},
                        "passedBases.id": baseID
                    }
                },
                {
                    $unwind: "$passedBases"
                }, 
                {
                    $match: {
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)},
                        "passedBases.id": baseID
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: { $toDate: "$passedBases.timestamp" } }
                            },
                            count: { $sum: 1 }
                    }
                }
            ])

            const receivedParcels = Parcels.aggregate([
                {
                    $match: {
                        passedBases: {$exist: true, $not: {$size: 0}},
                        status: 3,
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)},
                        "passedBases.id": baseID
                    }
                },
                {
                    $unwind: "$passedBases"
                }, 
                {
                    $match: {
                        "passedBases.timestamp": {$regex: new RegExp(`^${currentYear}-`)},
                        "passedBases.id": baseID
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: { $toDate: "$passedBases.timestamp" } }
                            },
                            count: { $sum: 1 }
                    }
                }
            ])

            Promise.all([totalParcels, receivedParcels])
                .then((results) => {
                    const [totalParcels, receivedParcels] = results
                    const statistic = {
                        totalParcels: totalParcels,
                        receivedParcels: receivedParcels
                    }
                    resolve(statistic)
                })
        })
    }
}