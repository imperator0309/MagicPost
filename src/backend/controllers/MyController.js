const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../../backend/ulti/mongoose')
const {getTotalStatistic, getBaseGeneralStatistic, getFromSenderStatistic, getToReceiverStatistic} = require('../middleware/statisticMiddleware')
class MyController {
    //[GET] /my/
    show(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            var userID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userID
            if (userRole == 0) {
                Actors.findById(userID)
                    .then(director => {
                        res.status(200).json({
                            name: director.name,
                            role: director.role,
                        })
                    })
                    
            } else if (userRole >= 1 && userRole <= 4) {
                let userBaseID = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).workAt
                const userData = Actors.findById(userID)
                const workingBase = Bases.findById(userBaseID)

                Promise.all([userData, workingBase])
                    .then(([user, base]) => {
                        res.status(200).json({
                            name: user.name,
                            role: user.role,
                            workAt: base._id,
                            baseLocation: base.baseLocation
                        })
                    })
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }
}

module.exports = new MyController