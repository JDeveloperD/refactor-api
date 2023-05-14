const Model = require('./model')
const { Types } = require('mongoose')

const allDetalles = () => {
  return Model.find({ esEliminado: false })
    .populate({
      path: 'salidaProgramada',
      select: '-createdAt -updatedAt',
      populate: [{
        path: 'paqueteTuristico',
        model: 'PaqueteTuristico',
        match: { esEliminado: false },
        select: 'nombrePaquete'
      }]
    })
    .populate({
      path: 'lugarEmbarque'
    })
}

const getDetalleBySalidaProgramada = (idSalidaProgramada) => {
  return Model.find({
    salidaProgramada: Types.ObjectId(idSalidaProgramada),
    esEliminado: false
  })
    .populate({
      path: 'salidaProgramada',
      select: '-createdAt -updatedAt',
      populate: [{
        path: 'paqueteTuristico',
        model: 'PaqueteTuristico',
        match: { esEliminado: false },
        select: 'nombrePaquete'
      }]
    })
    .populate({
      path: 'lugarEmbarque'
    })
}

const getDetalleByLugarEmbarque = (idLugarEmbarque) => {
  return Model.find({ lugarEmbarque: idLugarEmbarque, esEliminado: false })
    .populate({
      path: 'salidaProgramada',
      select: '-createdAt -updatedAt',
      populate: [{
        path: 'paqueteTuristico',
        model: 'PaqueteTuristico',
        match: { esEliminado: false },
        select: 'nombrePaquete'
      }]
    })
    .populate({
      path: 'lugarEmbarque'
    })
}

const getDetalleById = (id) => {
  return Model.findOne({ _id: id, esEliminado: false })
    .populate({
      path: 'salidaProgramada',
      select: '-createdAt -updatedAt',
      populate: [{
        path: 'paqueteTuristico',
        model: 'PaqueteTuristico',
        match: { esEliminado: false },
        select: 'nombrePaquete'
      }]
    })
    .populate({
      path: 'lugarEmbarque'
    })
}

const register = async (salidaProgramada, { lugarEmbarque, horaSalida }) => {
  const todalDocuments = await Model.countDocuments()
  const idGenerate = todalDocuments + 1
  const newDetail = await new Model({ _id: idGenerate, salidaProgramada, lugarEmbarque, horaSalida })
  return newDetail.save()
}

const remove = (id) => {
  return Model.findOneAndUpdate({ _id: id, esEliminado: false }, { esEliminado: true })
}

module.exports = {
  allDetalles,
  getDetalleBySalidaProgramada,
  getDetalleByLugarEmbarque,
  getDetalleById,
  register,
  remove
}
