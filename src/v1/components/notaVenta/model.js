const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pasajeroSchema = new Schema({
  _id: String,
  nombre: {
    type: String,
    trim: true,
    required: [true, 'Ingrese nombre']
  },
  detalleSalida: {
    type: Number,
    required: [true, 'El id detalle de salida es requerido']
  },
  celular: {
    type: String,
    trim: true
  }
})

const notaVentaSchema = new Schema(
  {
    _id: Number,
    codigoOperacion: Number,
    cliente: {
      type: String,
      ref: 'Cliente',
      required: [true, 'Ingrese cliente']
    },
    fechaRegistro: {
      type: Date,
      default: Date.now
    },
    fechaPago: {
      type: Date,
      default: Date.now
    },
    tipoCobro: {
      type: Number,
      ref: 'tipoCobro',
      required: [true, 'Ingrese tipo de cobro']
    },
    montoPago: {
      type: mongoose.Decimal128
    },
    pasajeros: [pasajeroSchema],
    masInfo: [
      {
        codigo: Number,
        name: String,
        checked: Boolean
      }
    ],
    estadoVenta: {
      type: Number,
      ref: 'EstadoVenta',
      default: 1,
      required: [true, 'Ingrese estado de venta']
    },
    salidaProgramada: {
      type: String,
      ref: 'salidaProgramada',
      required: [true, 'Ingrese salida programada']
    },
    esEliminado: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

notaVentaSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.montoPago = ret.montoPago.toString()
    return ret
  }
})

const model = mongoose.model('notaVenta', notaVentaSchema)

module.exports = model
