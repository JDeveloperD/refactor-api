const mongoose = require('mongoose')
const Schema = mongoose.Schema

const estadoPaqueteSchema = new Schema({
  _id: Number,
  estado: {
    type: String,
    required: [true, 'Ingresar estado de paquete'],
    trim: true
  }
}, { timestamps: true })

const model = mongoose.model('estadoPaquete', estadoPaqueteSchema)

module.exports = model
