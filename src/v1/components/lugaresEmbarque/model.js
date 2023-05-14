const mongoose = require('mongoose')

const lugaresEmbarqueSchema = new mongoose.Schema({
  _id: Number,
  nombre: {
    type: String,
    trim: true,
    required: [true, 'ingresar nombre']
  },
  referencia: {
    type: String,
    trim: true,
    required: [true, 'ingresar referencia']
  }
})

module.exports = mongoose.model('LugaresEmbarque', lugaresEmbarqueSchema)
