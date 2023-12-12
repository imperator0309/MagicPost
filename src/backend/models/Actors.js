const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema

const Actors = new Schema({
    //0 is director, 1 is manager lv1, 2 is manager lv2, 3 is staff
    role: {type: Number, required: true},
    name: {type: String, minLength: 2, required: true},
    username: {type: String, minLength: 6, maxLength: 30, required: true},
    password: {type: String, minLength: 6, maxLength: 14, required: true},
    workAt: {type: String},
})

module.exports = mongoose.model('Actors', Actors)