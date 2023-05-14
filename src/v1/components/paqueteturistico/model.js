const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const paqueteTuristicoSchema = new Schema({
  _id: Number,
  nombrePaquete: {
    type: String,
    trim: true,
    required: [true, 'Ingrese nombre']
  },
  precio: {
    type: Number,
    required: [true, 'Ingrese precio']
  },
  fotoPrincipal: {
    type: String,
    required: [true, 'Subir foto principal']
  },
  fotosAnexas: {
    anexa1: { type: String, default: null },
    anexa2: { type: String, default: null },
    anexa3: { type: String, default: null },
    anexa4: { type: String, default: null }
  },
  nombreURL: String,
  archivoItinerario: {
    type: String,
    required: [true, 'Subir itinerario']
  },
  zonaGeografica: {
    type: Number,
    ref: 'zonaGeografica',
    required: [true, 'Selecciona una zona geográfica']
  },
  estadoPaquete: {
    type: Number,
    ref: 'estadoPaquete',
    required: [true, 'Selecciona una estado para el paquete']
  },
  campaniaId: {
    type: Number,
    ref: 'Campaña',
    default: 0
  },
  esEliminado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

paqueteTuristicoSchema.plugin(mongoosePaginate)

module.exports = model('PaqueteTuristico', paqueteTuristicoSchema)
