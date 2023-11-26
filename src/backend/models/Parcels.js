const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema

const Parcels = new Schema({
    sentFrom: {type: String, required: true},
    sentTo: {type: String, required: true},
    //ids of bases that this parcel has passed
    passedBases: {type: [String]}, 
    orderDate: {type: Date},
    receivedDatd: {type: Date},
    senderName: {type: String, minLength: 2},
    senderPhone: {type: String, minLength: 10, maxLength: 10},
    receiverName: {type: String, minLength: 2},
    receiverPhone: {type: String, minLength: 10, maxLength: 10},
    weight: {type: Number},
    //0: is delivering, 1: success, 2: failed
    status: {type: Number}
})

module.exports = mongoose.model('Parcels', Parcels)