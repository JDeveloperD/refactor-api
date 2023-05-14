const mongoose = require('mongoose')
const Schema = mongoose.Schema

const datosSchema = new Schema({
  tipoDato: {
    type: Number,
    ref: 'tipoDato',
    required: [true, 'Ingresa el Tipo de Dato']
  },
  descripcionDato: {
    type: String,
    trim: true
  }
},
{ timestamps: true }
)

const otrosDatosSchema = new Schema({
  paqueteTuristico: {
    type: Number,
    ref: 'PaqueteTuristico',
    required: [true, 'Ingresa el Paquete Turistico']
  },
  listaDatos: [datosSchema]
},
{ timestamps: true }
)

const model = mongoose.model('OtrosDatos', otrosDatosSchema)

module.exports = model
