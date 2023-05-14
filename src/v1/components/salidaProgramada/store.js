const Model = require('./model')
const DetalleMdel = require('../detalle-salida/model')
const { getDetalleBySalidaProgramada } = require('../detalle-salida/store')

async function addSalidaProgramada ({ fechaSalida, fechaRetorno, horaRetorno, paqueteTuristico }) {
  const nuevaSalidaProgramada = await new Model({ fechaSalida, fechaRetorno, horaRetorno, paqueteTuristico })
  return nuevaSalidaProgramada.save()
}

const listarSalidas = async () => {
  return Model.find({ esEliminado: false })
    .populate({
      path: 'paqueteTuristico',
      select: 'nombrePaquete'
    })
    .sort({ createdAt: 'desc' })
}

const obtenerSalidaProgramada = async (codigo) => {
  return await Model.findOne({ _id: codigo, esEliminado: false })
    .populate({
      path: 'paqueteTuristico',
      select: 'nombrePaquete'
    })
}

async function counter (codigo) {
  try {
    return await Model.find({ _id: codigo }).count({})
  } catch (error) {
    return `Error en la capa store: ${error}`
  }
}

async function updateSalidaProgramada (codigo, data) {
  return await Model.findOneAndUpdate(
    { _id: codigo, esEliminado: false },
    data,
    {
      new: true,
      runValidation: true
    })
    .populate({
      path: 'paqueteTuristico',
      select: 'nombrePaquete'
    })
}

async function deleteSalidaProgramada (codigo) {
  try {
    const salidaProgramada = await Model.findOneAndUpdate(
      { _id: codigo, esEliminado: false },
      { esEliminado: true },
      {
        new: true
      }
    )
    return salidaProgramada
  } catch (err) {
    return err.message
  }
}

async function existeSalidaProgramada (codigo) {
  try {
    return await Model.exists({ _id: codigo, esEliminado: false })
  } catch (err) {
    console.log(err)
  }
}

async function buscarSalida (query) {
  const finalQuery = { esEliminado: false }

  if (query.fechaSalida) {
    const rango = query.fechaSalida.split(',')
    const desde = new Date(`${rango[0]}T00:00:00.000Z`)
    const hasta = new Date(`${rango[1]}T23:59:59Z`)

    finalQuery.fechaSalida = { $gte: desde, $lte: hasta }
  }

  // console.log(finalQuery)

  const salidas = await Model.find(finalQuery).sort({ fechaSalida: 'desc' }).populate({
    path: 'paqueteTuristico',
    select: 'nombrePaquete'
  })
  const result = []

  for (let i = 0; i < salidas.length; i++) {
    const salida = salidas[i]
    const idSalida = salida._id
    const detalle = await DetalleMdel.find({ salidaProgramada: idSalida }).select('horaSalida lugarEmbarque').populate('lugarEmbarque')

    result.push({
      _id: salida._id,
      fechaSalida: salida.fechaSalida,
      fechaRetorno: salida.fechaRetorno,
      horaRetorno: salida.horaRetorno,
      detalle: detalle.length > 0 ? detalle[0] : null,
      esEliminado: salida.esEliminado,
      paqueteTuristico: salida.paqueteTuristico
    })
  }

  return result
}

async function buscarPaqueteByFilter (query) {
  const filterOne = {
    $match: {
      esEliminado: false
    }
  }

  const filterTwo = {
    $match: {
      'paqueteTuristico.campaniaId': 0
    }
  }

  if (query.fechaSalida) {
    const rango = query.fechaSalida.split(',')
    const desde = new Date(`${rango[0]}T00:00:00.000Z`)
    const hasta = new Date(`${rango[1]}T23:59:59Z`)

    filterOne.$match = {
      esEliminado: false,
      fechaSalida: { $gte: desde, $lt: hasta }
    }
  }

  if (query.zonaGeografica) {
    filterTwo.$match = {
      ...filterTwo.$match,
      'paqueteTuristico.zonaGeografica': Number(query.zonaGeografica)
    }
  }

  if (query.estadoPaquete) {
    filterTwo.$match = {
      ...filterTwo.$match,
      'paqueteTuristico.estadoPaquete': Number(query.estadoPaquete)
    }
  }

  const mongoQuery = [
    filterOne,
    {
      $lookup: {
        from: 'paqueteturisticos',
        localField: 'paqueteTuristico',
        foreignField: '_id',
        as: 'paqueteTuristico'
      }
    },
    { $unwind: '$paqueteTuristico' },
    filterTwo
  ]

  return await Model.aggregate(mongoQuery)
}

async function listByPaquete (codigo) {
  // return Model.find({ paqueteTuristico: codigo }).sort({ createdAt: 'desc' })

  const salidas = await Model.find({ paqueteTuristico: codigo, esEliminado: false })

  const result = []

  for (let i = 0; i < salidas.length; i++) {
    const salida = salidas[i]
    const idSalida = salida._id
    const detalle = await DetalleMdel.find({ salidaProgramada: idSalida }).select('lugarEmbarque horaSalida').populate('lugarEmbarque')

    const lugarEmbarqueString = detalle.map(det => det.lugarEmbarque.nombre).join(' / ')

    result.push({
      _id: salida._id,
      fechaSalida: salida.fechaSalida,
      fechaRetorno: salida.fechaRetorno,
      horaRetorno: salida.horaRetorno,
      esEliminado: salida.esEliminado,
      lugarEmbarque: lugarEmbarqueString,
      visibility: salida.visibility,
      detalle: detalle.length > 0 ? detalle : null
    })
  }

  return result
}

async function changeVisibility (codigo) {
  const salida = await obtenerSalidaProgramada(codigo)
  return await Model.findOneAndUpdate(
    { _id: codigo, esEliminado: false },
    { visibility: !salida.visibility },
    {
      new: true,
      runValidation: true
    }
  )
}

module.exports = {
  add: addSalidaProgramada,
  listAll: listarSalidas,
  list: obtenerSalidaProgramada,
  count: counter,
  update: updateSalidaProgramada,
  delete: deleteSalidaProgramada,
  exist: existeSalidaProgramada,
  buscar: buscarSalida,
  buscarPaqueteByFilter,
  listByPaquete,
  changeVisibility
}
