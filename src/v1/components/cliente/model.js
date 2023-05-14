const { model, Schema } = require('mongoose')

const clienteSchema = new Schema({
  _id: {
    type: String,
    minLength: 8
  },
  nombre: {
    type: String,
    required: [true, 'Ingresar nombre'],
    trim: true
  },
  celular: {
    type: Number,
    required: [true, 'Ingrese número de celular']
  },
  celularAlterno: Number,
  correo: {
    type: String,
    required: [true, 'Ingrese correo'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Ingrese un correo válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Ingrese su contraseña'],
    minlength: 6
  },
  tipoDocumento: {
    type: Number,
    ref: 'TipoDocumento',
    required: true
  },
  codigoVerificacion: String
}, { timestamps: true })

module.exports = model('Cliente', clienteSchema)
