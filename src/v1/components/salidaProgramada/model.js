const mongoose = require('mongoose')
const Schema = mongoose.Schema

const horaSchema = new Schema({
  hora: {
    type: Number,
    required: true,
    min: 1,
    max: [12, 'From 1 to 12']
  },
  minutos: {
    type: Number,
    required: true,
    min: 0,
    max: [59, 'From 0 to 59']
  },
  meridiano: {
    type: String,
    enum: ['am', 'pm'],
    required: true
  }
})

const salidaProgramadaSchema = new Schema({
  fechaSalida: {
    type: Date,
    required: true
  },
  fechaRetorno: {
    type: Date,
    required: true
  },
  horaRetorno: {
    type: horaSchema,
    required: true
  },
  paqueteTuristico: {
    type: Number,
    ref: 'PaqueteTuristico',
    required: [true, 'Ingrese paquete turistico']
  },
  visibility: {
    type: Boolean,
    default: true
  },
  esEliminado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const model = mongoose.model('salidaProgramada', salidaProgramadaSchema)

module.exports = model
