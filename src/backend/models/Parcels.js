const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema

const Parcels = new Schema({
    sentFrom: {type: String, required: true},
    sentTo: {type: String, required: true},
    //ids of bases that this parcel has passed
    passedBases: {type: [Object]},
    nextBase: {type: String},
    orderDate: {type: Date},
    finishedDate: {type: Date},
    senderName: {type: String, minLength: 2},
    senderPhone: {type: String, minLength: 10, maxLength: 10},
    receiverName: {type: String, minLength: 2},
    receiverPhone: {type: String, minLength: 10, maxLength: 10},
    weight: {type: Number},
    price: {type: Number},
    /**
     * Parcel status code:
     * 0: processing
     * 1: delivering
     * 2: forward to receiver
     * 3: forwarded successfully
     * 4: forwarded failed
     */
    status: {type: Number}
})

module.exports = mongoose.model('Parcels', Parcels)