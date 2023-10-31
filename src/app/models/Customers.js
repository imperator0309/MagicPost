const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema

const Customers = new Schema({
    name: {type: String, minLength: 2, required: true},
    address: {type: String, minLength: 2},
    phoneNumber: {type: String, minLength: 10, maxLength: 10, required: 2}
})

module.exports = mongoose.model('Customers', Customers)