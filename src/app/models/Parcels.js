const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema

const Parcels = new Schema({
    senderID: {type: String, required: true},
    receiverID: {type: String, required: true},
    sentFrom: {type: String, required: true},
    sentTo: {type: String, required: true},
    //ids of bases that this parcel has passed
    passedBases: {type: [String]}, 
    orderDate: {type: Date},
    receivedDatd: {type: Date},

    //0: is delivering, 1: success, 2: failed
    status: {type: Number}
})

module.exports = mongoose.model('Parcels', Parcels)