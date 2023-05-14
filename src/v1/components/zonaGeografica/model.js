const mongoose = require('mongoose')
const Schema = mongoose.Schema

const zonaGeograficaSchema = new Schema({
  _id: Number,
  nombreZona: { type: String, require: true }
}, { timestamps: true })

const model = mongoose.model('zonaGeografica', zonaGeograficaSchema)

module.exports = model
