const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Schema = mongoose.Schema

const Bases = new Schema({//0 is concentration base, 1 is transaction base
    baseType: {type: Number, required: true},
    baseLocation: {type: String, minLength: 2, required: true},
    managerID: {type: String},
    StaffIDs: {type: [String]}
})

module.exports = mongoose.model('Bases', Bases)