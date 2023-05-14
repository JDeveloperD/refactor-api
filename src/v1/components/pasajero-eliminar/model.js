const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pasajeroSchema = new Schema({
    _id: Number,
    nombres: { type: String, require: true },
    lugarEmbarque: { type: Number, require: true },
    notaVenta: { type: Number, require: true, ref: 'notaVenta' }
    // lugarEmbarque: { type: Number, ref: "lugarEmbarque", require: true },
}, { timestamps: true })

const model = mongoose.model('pasajero', pasajeroSchema);

module.exports = model

