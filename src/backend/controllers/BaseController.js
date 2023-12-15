const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../ulti/mongoose')
require('dotenv').config()

class BaseController {
    //[GET] /base/view?page=
    viewBases(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 0
        page = isNaN(page) ? 0 : page
        page = page < 0 ? 0 : page

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                const distributionBases = Bases.find({baseType: 0})
                    .sort({_id: 1})
                    .skip((page * pageSize))
                    .limit(pageSize)

                const transactionBases = Bases.find({baseType: 1})
                    .sort({_id: 1})
                    .skip((page * pageSize))
                    .limit(pageSize)

                Promise.all([distributionBases, transactionBases])
                    .then(([distributionBases, transactionBases]) => {
                        res.status(200).json({
                            distributionBases: multipleMongooseToObject(distributionBases),
                            transactionBases: multipleMongooseToObject(transactionBases)
                        })
                    })    
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[GET] /base/create
    showCreateBasePage(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Bases.find({baseType: 0})
                    .then(bases => {
                        res.status(200).json({
                            superiorBases: multipleMongooseToObject(bases)
                        })
                    })
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[POST] /base/create
    createBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                var baseData = req.body
                const base = new Bases(baseData)
                base.save()
                    .then(res.status(200).json('Create Base Successfully'))
            } else {
                res.status(403).json('Permission Denied')
            }
        } else {
            res.status(401).json('Permission Denied')
        }
    }

    //[DELETE] /base/delete
    deleteBase(req, res, next) {
        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Actors.deleteMany({_id: {$in: req.body.baseIDs}})
                    .then(() => {
                        Actors.updateMany({workAt: {$in: req.body.baseIDs}}, {$unset: {workAt: ""}})
                            .then(() => {
                                res.status(200).json({message: 'Delete Bases Successfully'})
                            })
                    })
            } else {
                res.status(403).json({message: 'Permission Denied'})
            }
        } else {
            res.status(401).json({message: 'Permission Denied'})
        }
    }
}

module.exports = new BaseController