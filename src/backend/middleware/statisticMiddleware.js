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
    
            const successParcels = Parcels.aggregate([
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

            const failedParcels = Parcels.aggregate([
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
    
            Promise.all([totalParcels, successParcels, failedParcels])
                .then((results) => {
                    const [totalParcels, successParcels, failedParcels] = results
                    const statistic = {
                        totalParcels: totalParcels,
                        successParcels: successParcels,
                        failedParcels: failedParcels
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
    
            const deliveredParcels = Parcels.aggregate([
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
    
            Promise.all([totalParcels, deliveredParcels])
                .then((results) => {
                    const [totalParcels, deliveredParcels] = results
                    const statistic = {
                        totalParcels: totalParcels,
                        deliveredParcels: deliveredParcels
                    }
                    resolve(statistic)
                })
        })
    },
    
    getSentAndReceivedStatistic: function(baseID) {
        return new Promise((resolve, reject) => {
            const currentYear = (new Date()).getFullYear()
    
            const receivedParcels = Parcels.aggregate([
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
    
            const deliveredParcels = Parcels.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{$arrayElemAt: ["$passedBases.id", -1]}, baseID] },
                                { $eq: [{$toInt: {$substr: [{$arrayElemAt: ["$passedBases.timestamp", -1]}, 0, 4]}}, currentYear] },
                                { $gt: ["$status", 0] }
                            ]
                        }
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

            const successParcels = Parcels.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{$arrayElemAt: ["$passedBases.id", 0]}, baseID] },
                                { $eq: [{$toInt: {$substr: [{$arrayElemAt: ["$passedBases.timestamp", -1]}, 0, 4]}}, currentYear] },
                                { $eq: ["$status", 3] }
                            ]
                        }
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

            const failedParcels = Parcels.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{$arrayElemAt: ["$passedBases.id", -1]}, baseID] },
                                // { $eq: [{$toInt: {$substr: [{$arrayElemAt: ["$passedBases.timestamp", -1]}, 0, 4]}}, currentYear] },
                                { $eq: ["$status", 4] }
                            ]
                        }
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
    
            Promise.all([receivedParcels, deliveredParcels, successParcels, failedParcels])
                .then((results) => {
                    const [receivedParcels, deliveredParcels, successParcels, failedParcels] = results
                    const statistic = {
                        receivedParcels: receivedParcels,
                        deliveredParcels: deliveredParcels,
                        successParcels: successParcels,
                        failedParcels: failedParcels
                    }
                    resolve(statistic)
                })
        })
    }
}