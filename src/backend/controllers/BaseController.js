const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')
const {multipleMongooseToObject, mongooseToObject} = require('../ulti/mongoose')
require('dotenv').config()

class BaseController {
    //[GET] /base/view?baseType=&page=
    viewBases(req, res, next) {
        const pageSize = parseInt(process.env.PAGE_SIZE)
        var page = req.query.page ? parseInt(req.query.page) : 0
        page = isNaN(page) ? 0 : page
        page = page < 0 ? 0 : page

        const typeFilter = req.query.baseType ? (isNaN(parseInt(req.query.baseType)) ? [0, 1] : [parseInt(req.query.baseType)]) : [0, 1]

        if (req.cookies.jwt) {
            var userRole = jwt.verify(req.cookies.jwt, process.env.TOKEN_KEY).userRole
            if (userRole == 0) {
                Bases.find({baseType: {$in: typeFilter}})
                    .sort({_id: -1})
                    .skip((page * pageSize))
                    .limit(pageSize)
                    .then(base => {
                        res.status(200).json({
                            base: multipleMongooseToObject(base)
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
                    .catch(err => {
                        res.status(500).json("Data invalid")
                    })
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
                            .catch(err => {
                                res.status(500).json("Data invalid")
                            })
                    })
                    .catch(err => {
                        res.status(500).json("Data invalid")
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