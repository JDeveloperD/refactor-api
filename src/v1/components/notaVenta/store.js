const Model = require('./model')
const { formatDate } = require('./services')

const crearNotaVenta = async (notaVenta) => {
  return await Model.create(notaVenta)
}

const obtenerNotaVenta = async (codigo) => {
  try {
    const notaVenta = await Model.findOne({ _id: codigo, esEliminado: false }, { esEliminado: 0, createdAt: 0, updatedAt: 0 })
      .populate({
        path: 'cliente',
        model: 'Cliente',
        select: 'nombre tipoDocumento',
        populate: [
          {
            path: 'tipoDocumento',
            model: 'TipoDocumento',
            select: 'nombreTipoDoc'
          }
        ]
      })
      .populate('tipoCobro')
      .populate('estadoVenta')
      .populate({
        path: 'salidaProgramada',
        select: 'fechaSalida paqueteTuristico',
        populate: [
          {
            path: 'paqueteTuristico',
            select: 'nombrePaquete'
          }
        ]
      })
      .populate({
        path: 'pasajeros',
        populate: [
          {
            path: 'detalleSalida',
            model: 'DetalleSalida',
            match: { esEliminado: false },
            select: 'lugarEmbarque horaSalida',
            populate: [
              {
                path: 'lugarEmbarque',
                model: 'LugaresEmbarque',
                select: 'nombre referencia'
              }
            ]
          }
        ]
      })

    if (!notaVenta) {
      throw Error(`Nota de venta con codigo ${codigo} no existe`)
    }

    return notaVenta
  } catch (error) {
    return error.message
  }
}

const obtenerListaNotas = () => {
  return Model.find({ esEliminado: false })
}

const obtenerPaquetesMasVendidos = () => {
  return Model.find({ esEliminado: false })
    .populate({
      path: 'salidaProgramada',
      select: 'fechaSalida paqueteTuristico',
      populate: [
        {
          path: 'paqueteTuristico',
          select: 'nombrePaquete'
        }
      ]
    })
}

const actualizarNotaVenta = (codigo, notaVenta) => {
  return Model.findOneAndUpdate(
    { _id: codigo, esEliminado: false },
    notaVenta,
    {
      new: true,
      runValidation: true
    }
  )
}

const eliminarNotaVenta = async (codigo) => {
  try {
    const notaVenta = await Model.findOneAndUpdate(
      { _id: codigo, esEliminado: false },
      { esEliminado: true },
      {
        new: true,
        runValidation: true
      }
    )
    if (!notaVenta) {
      throw Error(`Competencia con codigo ${codigo} no existe`)
    }
    return notaVenta
  } catch (error) {
    return error.message
  }
}

const actualizarPasajero = async (
  codigoNotaVenta,
  codigoPasajero,
  pasajero
) => {
  try {
    const notaVenta = await Model.findOne({ _id: codigoNotaVenta })

    if (!notaVenta) {
      throw Error(`Nota de venta con codigo ${codigoNotaVenta} no existe`)
    }

    const subPasajeros = notaVenta.pasajeros
    subPasajeros.forEach((subPasajero) => {
      if (String(subPasajero._id) === codigoPasajero) {
        return subPasajero.set(pasajero)
      }
    })

    return notaVenta.save()
  } catch (error) {
    return error.message
  }
}

const obtenerNotasVentasPorFechas = (startDate, endDate) => {
  const newdate = formatDate(endDate) + 'T23:59:59Z'
  try {
    const notasVentas = Model.find({
      fechaPago: {
        $gte: new Date(startDate),
        $lte: new Date(newdate)
      }
    }).sort({ createdAt: 'desc' })
      .populate({
        path: 'cliente',
        model: 'Cliente',
        select: 'nombre tipoDocumento celular',
        populate: [
          {
            path: 'tipoDocumento',
            model: 'TipoDocumento',
            select: 'nombreTipoDoc'
          }
        ]
      })
      .populate({
        path: 'pasajeros',
        populate: [
          {
            path: 'detalleSalida',
            model: 'DetalleSalida',
            match: { esEliminado: false },
            select: 'lugarEmbarque horaSalida',
            populate: [
              {
                path: 'lugarEmbarque',
                model: 'LugaresEmbarque',
                select: 'nombre'
              }
            ]
          }
        ]
      })
      .populate({
        path: 'salidaProgramada',
        populate: [
          {
            path: 'paqueteTuristico',
            select: 'nombrePaquete'
          }
        ]
      })

    if (!notasVentas) {
      throw Error('No existen ventas en las fechas seleccionadas')
    }

    return notasVentas
  } catch (error) {
    return error.message
  }
}

const obtenerNumeroNotasVentas = async () => {
  return await Model.countDocuments()
}

const obtenerDetallesBySalida = async (id) => {
  const results = await Model.find({ salidaProgramada: id, esEliminado: false })
    .populate({
      path: 'cliente',
      select: 'nombre celular',
      match: { esEliminado: false }
    })
    .populate({
      path: 'salidaProgramada',
      select: 'fechaSalida fechaRetorno paqueteTuristico',
      match: { esEliminado: false },
      populate: [
        {
          path: 'paqueteTuristico',
          model: 'PaqueteTuristico',
          select: 'nombrePaquete'
        }
      ]
    })
    .populate({
      path: 'pasajeros',
      populate: [
        {
          path: 'detalleSalida',
          model: 'DetalleSalida',
          match: { esEliminado: false },
          select: 'lugarEmbarque horaSalida',
          populate: [
            {
              path: 'lugarEmbarque',
              model: 'LugaresEmbarque',
              select: 'nombre'
            }
          ]
        }
      ]
    })

  let totalPasajeros = 0
  const haveResults = results.length > 0

  if (haveResults) {
    results.forEach(item => {
      totalPasajeros += item.pasajeros.length
    })
  }

  return {
    paqueteTuristico: haveResults ? results[0].salidaProgramada.paqueteTuristico.nombrePaquete : null,
    salidaProgramada: haveResults ? results[0].salidaProgramada : null,
    totalPasajeros,
    details: results
  }
}

const buscar = async (query) => {
  return Model.find()
    .populate('salidaProgramada')
}

module.exports = {
  crear: crearNotaVenta,
  obtener: obtenerNotaVenta,
  obtenerTodos: obtenerListaNotas,
  actualizar: actualizarNotaVenta,
  eliminar: eliminarNotaVenta,
  actualizarPasajero,
  notaVentaPorFecha: obtenerNotasVentasPorFechas,
  obtenerMasVendido: obtenerPaquetesMasVendidos,
  totalDocumentos: obtenerNumeroNotasVentas,
  detalles: obtenerDetallesBySalida,
  buscar
}
