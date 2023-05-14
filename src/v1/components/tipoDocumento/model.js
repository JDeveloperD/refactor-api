const mongoose = require('mongoose')

const tipoDocumentoSchema = new mongoose.Schema({
  _id: Number,
  nombreTipoDoc: {
    type: String,
    required: [true, 'ingresar nombre'],
    trim: true
  }
})

module.exports = mongoose.model('TipoDocumento', tipoDocumentoSchema)
