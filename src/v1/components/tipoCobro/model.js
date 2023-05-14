const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tipoCobroSchema = new Schema({
    _id: Number,
    nombreTipoCobro: { type: String, require: true }
}, { timestamps: true })

const model = mongoose.model('tipoCobro', tipoCobroSchema);

module.exports = model

