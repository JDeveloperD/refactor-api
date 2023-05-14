const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tipoDatoSchema = new Schema({
  _id: Number,
  nombreTipoDato: {
    type: String,
    required: [true, 'Ingresar tipo de dato'],
    trim: true
  }
}, { timestamps: true })

const model = mongoose.model('tipoDato', tipoDatoSchema)

module.exports = model
