const mongoose = require('mongoose')
const Schema = mongoose.Schema

const estadoVentaSchema = new Schema({
  _id: Number,
  nombreEstado: {
    type: String,
    required: true,
    trim: true
  }

}, { timestamps: true })

const model = mongoose.model('EstadoVenta', estadoVentaSchema)
module.exports = model
