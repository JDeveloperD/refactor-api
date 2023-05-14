const mongoose = require('mongoose')
const Schema = mongoose.Schema

const campañaSchema = new Schema({
  _id: Number,
  nombreCampaña: {
    type: String
  },
  colorButton: {
    type: String,
    default: '#BFBFBF'
  },
  visibilidad: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const model = mongoose.model('Campaña', campañaSchema)
module.exports = model
