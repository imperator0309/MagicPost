const Parcels = require('../models/Parcels')
const Actors = require('../models/Actors')
const Bases = require('../models/Bases')
const jwt = require('jsonwebtoken')

module.exports = {
    getTotalStatistic: function() {
        return new Promise((resolve, reject) => {
            const currentYear = (new Date()).getFullYear()
    
            const totalParcels = Parcels.aggregate([
                {
                    $match: {
                        "passedBases.0.timestamp": { $regex: `^${currentYear}` }
                    }
                },
                {
                    $project: {
                        month: {$substr: [{ $arrayElemAt: ["$passedBases.timestamp", 0]}, 5, 2]}
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        count: { $sum: 1}
                    }
                },
                {
                    $sort: {_id: 1}
                }
            ])
    
            const receivedParcels = Parcels.aggregate([
                {
                    $match: {
                        "passedBases.0.timestamp": { $regex: `^${currentYear}` },
                        status: 3
                    }
                },
                {
                    $project: {
                        month: {$substr: [{ $arrayElemAt: ["$passedBases.timestamp", 0]}, 5, 2]}
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        count: { $sum: 1}
                    }
                },
                {
                    $sort: {_id: 1}
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
    },
    
    getBaseGeneralStatistic: function(baseID) {
        return new Promise((resolve, reject) => {
            const currentYear = (new Date()).getFullYear()
    
            const totalParcels = Parcels.aggregate([
                {
                    $unwind: "$passedBases"
                },
                {
                    $match: {
                        "passedBases.id": baseID,
                        $expr: {
                            $eq: [{ $year: { $toDate: '$passedBases.timestamp' } }, currentYear]
                        }
                    }
                },
                {
                    $group: {
                      _id: { $month: { $toDate: '$passedBases.timestamp' } },
                      count: { $sum: 1 }
                    }
                },
                {
                    $sort: {_id: 1}
                }
            ])
    
            const receivedParcels = Parcels.aggregate([
                {
                    $unwind: "$passedBases"
                },
                {
                    $match: {
                        "passedBases.id": baseID,
                        $expr: {
                            $eq: [{ $year: { $toDate: '$passedBases.timestamp' } }, currentYear]
                        },
                        "passedBases.leave": {$exists: true}
                    }
                },
                {
                    $group: {
                      _id: { $month: { $toDate: '$passedBases.timestamp' } },
                      count: { $sum: 1 }
                    }
                },
                {
                    $sort: {_id: 1}
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
    },
    
    getSentAndReceivedStatistic: function(baseID) {
        return new Promise((resolve, reject) => {
            const currentYear = (new Date()).getFullYear()
    
            const totalParcels = Parcels.aggregate([
                {
                    $match: {
                        "passedBases.0.timestamp": { $regex: `^${currentYear}` },
                        "passedBases.0.id": baseID
                    }
                },
                {
                    $project: {
                        month: {$substr: [{ $arrayElemAt: ["$passedBases.timestamp", 0]}, 5, 2]}
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        count: { $sum: 1}
                    }
                },
                {
                    $sort: {_id: 1}
                }
            ])
    
            const receivedParcels = Parcels.aggregate([
                {
                    $match: {
                        "passedBases": {
                            $elemMatch: {
                                $expr: {
                                    $eq: [
                                        { $arrayElemAt: ["$passedBases.id", -1] },
                                        baseID
                                    ]
                                },
                                $expr: {
                                    $eq: [
                                        {$toInt: {$substr: [{$arrayElemAt: ["$passedBases.timestamp", -1]}, 0, 4]}},
                                        currentYear
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        month: { $month: { $dateFromString: { dateString: { $arrayElemAt: ["$passedBases.timestamp", -1] } } } }
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        count: { $sum: 1}
                    }
                },
                {
                    $sort: {_id: 1}
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