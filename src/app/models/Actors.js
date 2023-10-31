const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema

const Actors = new Schema({
    role: {type: Number, required: true},
    name: {type: String, minLength: 2, required: true},
    username: {type: String, minLength: 6, maxLength: 14, required: true},
    password: {type: String, minLength: 6, maxLength: 14, required: true},
})

module.exports = mongoose.model('Actors', Actors)