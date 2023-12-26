const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const {getTotalStatistic, getBaseGeneralStatistic, getFromSenderStatistic, getToReceiverStatistic} = require('../middleware/statisticMiddleware')

class StatisticController {
    //[GET] /statistic/general
    showGeneralStatistic(req, res, next) {
        if (req.body.jwt) {
            var userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            var userID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userID
            if (userRole == 0) {
                var statistic
                getTotalStatistic().then((result) => {
                    statistic = result 

                    const distributionBases = Bases.find({baseType: 0})
                    const transactionBases = Bases.find({baseType: 1})

                    Promise.all([distributionBases, transactionBases])
                        .then(([distributionBases, transactionBases]) => {
                            res.status(200).json({
                                distributionBases: multipleMongooseToObject(distributionBases),
                                transactionBases: multipleMongooseToObject(transactionBases),
                                total: statistic.totalParcels,
                                success: statistic.successParcels,
                                failed: statistic.failedParcels
                            })
                        })
                })
            } else if (userRole == 1 || userRole == 2) {
                let userBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
                var statistic
                getBaseGeneralStatistic(userBaseID).then((result) => {
                    res.status(200).json({
                        total: result.totalParcels,
                        delivered: result.deliveredParcels
                    })
                })
                
            } 
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }

    //[GET] /statistic/base?id=
    showStatisticByBase(req, res, next) {
        if (req.body.jwt) {
            const userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            const baseID = req.query.id
            if (req.query.id) {
                if (userRole == 0) {
                    var statistic
                    getBaseGeneralStatistic(baseID).then((result) => {
                        statistic = result
                        res.status(200).json({
                            total: statistic.totalParcels,
                            delivered: statistic.receivedParcels
                        })
                    })
                } else {
                    res.status(403).json('Permission Denied')
                }
            } else {
                res.status(400).json("Must specify base id")
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[GET] /statistic/from-sender
    showFromSenderStatistic(req, res, next) {
        if (req.body.jwt) {
            const userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            const userBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 2) {
                var statistic
                getFromSenderStatistic(userBaseID).then((result) => {
                    statistic = result
                    res.status(200).json({
                        received: statistic.receivedParcels,
                        success: statistic.successParcels,
                        failed: statistic.failedParcels
                    })
                })
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[GET] /statistic/to-receiver
    showToReceiverStatistic(req, res, next) {
        if (req.body.jwt) {
            const userRole = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).userRole
            const userBaseID = jwt.verify(req.body.jwt, process.env.TOKEN_KEY).workAt
            if (userRole == 2) {
                var statistic
                getToReceiverStatistic(userBaseID).then((result) => {
                    statistic = result
                    res.status(200).json({
                        received: statistic.receivedParcels,
                        success: statistic.successParcels,
                        failed: statistic.failedParcels
                    })
                })
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }
}

module.exports = new StatisticController