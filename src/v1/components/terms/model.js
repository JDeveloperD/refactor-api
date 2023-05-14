const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TermsContions = Schema({
  _id: String,
  text: String
}, { timestamps: true })

const model = mongoose.model('Terms', TermsContions)

module.exports = model
