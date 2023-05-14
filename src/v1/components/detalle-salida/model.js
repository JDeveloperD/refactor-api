const { model, Schema } = require('mongoose')

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

const DetalleSalidaSchema = new Schema({
  _id: {
    type: Number
  },
  salidaProgramada: {
    type: Schema.Types.ObjectId,
    ref: 'salidaProgramada',
    required: [true, 'Ingrese salida programada']
  },
  lugarEmbarque: {
    type: Number,
    ref: 'LugaresEmbarque',
    required: [true, 'Ingresar Lugar de embarque']
  },
  horaSalida: {
    type: horaSchema,
    required: true
  },
  esEliminado: {
    type: Boolean,
    default: false
  }
})

module.exports = model('DetalleSalida', DetalleSalidaSchema)
