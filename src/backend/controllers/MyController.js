const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const {getTotalStatistic, getBaseGeneralStatistic, getSentAndReceivedStatistic} = require('../middleware/statisticMiddleware')
class MyController {
    //[GET] /my/
    show(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var userID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userID
            if (userRole == 0) {
                var statistic
                getTotalStatistic().then((result) => {
                    statistic = result 

                    const distributionBases = Bases.find({baseType: 0})
                    const transactionBases = Bases.find({baseType: 1})
                    const director = Actors.findById(userID)

                    Promise.all([director, distributionBases, transactionBases])
                        .then(([director, distributionBases, transactionBases]) => {
                            res.status(200).json({
                                name: director.name,
                                role: director.role,
                                distributionBases: multipleMongooseToObject(distributionBases),
                                transactionBases: multipleMongooseToObject(transactionBases),
                                total: statistic.totalParcels,
                                received: statistic.receivedParcels
                            })
                        })
                })
            } else if (userRole == 1 || userRole == 2) {
                let userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                var statistic
                getBaseGeneralStatistic(userBaseID).then((result) => {
                    statistic = result

                    const userData = Actors.findById(userID)
                    const workingBase = Bases.findById({_id: userBaseID})
                    
                    Promise.all([userData, workingBase])
                        .then(([user, base]) => {
                            res.status(200).json({
                                name: user.name,
                                baseID: base._id,
                                baseLocation: base.baseLocation,
                                total: statistic.totalParcels,
                                received: statistic.receivedParcels
                            })
                        })
                })
                
            } else if (userRole == 3 || 4) {
                let userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                const userData = Actors.findById(userID)
                const workingBase = Bases.findById(userBaseID)

                Promise.all([userData, workingBase])
                    .then(([user, base]) => {
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

    //[GET] /my/statistic?id=
    showStatisticByBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            const baseID = req.query.id
            if (userRole == 0 || userRole == 1) {
                var statistic
                getBaseGeneralStatistic(baseID).then((result) => {
                    statistic = result
                    res.status(200).json({
                        total: statistic.totalParcels,
                        received: statistic.receivedParcels
                    })
                })
            } else if (userRole == 2) {
                var statistic
                getSentAndReceivedStatistic(baseID).then((result) => {
                    statistic = result
                    res.status(200).json({
                        total: statistic.totalParcels,
                        received: statistic.receivedParcels
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

module.exports = new MyController