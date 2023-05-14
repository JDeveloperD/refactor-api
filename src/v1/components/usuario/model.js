const moongose = require('mongoose')
const Schema = moongose.Schema

const usuarioSchema = new Schema({
  _id: Number,
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  celular: Number
}, { timestamps: true })

const Usuario = moongose.model('Usuario', usuarioSchema)

module.exports = Usuario
