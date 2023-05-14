const Model = require('./model')
const { containsObject } = require('./services')

function obtenerTodos () {
  return Model
    .find(
      { esEliminado: false },
      { __v: 0, createdAt: 0, updatedAt: 0 },
      { sort: [{ createdAt: 'desc' }] })
    .populate('zonaGeografica', 'nombreZona')
    .populate('estadoPaquete', 'estado')
}

function obtenerPorId (id) {
  return Model
    .findOne(
      { _id: id, esEliminado: false },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    )
    .populate('zonaGeografica', 'nombreZona')
    .populate('estadoPaquete', 'estado')
}

function obtenerPorCampania (id) {
  return Model
    .find(
      { campaniaId: id, esEliminado: false },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    )
    .populate('zonaGeografica', 'nombreZona')
    .populate('estadoPaquete', 'estado')
}

async function crear (data) {
  const nuevoPaquete = new Model(data)
  return nuevoPaquete.save()
}

const editar = async (id, paquete) => {
  const anexasActuales = await Model.findById(id).select('fotosAnexas')
  paquete.fotosAnexas = { ...anexasActuales.fotosAnexas, ...paquete.fotosAnexas }

  const paqueteEditado = await Model.findOneAndUpdate(
    { _id: id, esEliminado: false },
    paquete,
    {
      new: true,
      runValidation: true
    }
  )

  return paqueteEditado
}

function eliminar (id) {
  return Model
    .findOneAndUpdate({ _id: id, esEliminado: false }, { esEliminado: true })
}

async function buscar (query) {
  try {
    const {
      limit,
      page
    } = query

    let finalQuery = { esEliminado: false }

    const options = {
      select: 'nombrePaquete precio fotoPrincipal nombreURL estadoPaquete zonaGeografica campaniaId',
      sort: { updatedAt: 'desc' },
      limit: Number(limit) || 10,
      page: Number(page) || 1
    }

    if (query._id) {
      if (Array.isArray(query._id)) {
        finalQuery._id = query._id.filter(id => id !== 'undefined')
      } else {
        finalQuery._id = query._id
      }
    }

    if (query.nombrePaquete) {
      finalQuery.nombrePaquete = {
        $regex: query.nombrePaquete,
        $options: 'i'
      }
    }

    if (query.precio) {
      const rango = query.precio.split(',')
      const min = rango[0]
      const max = rango[1]
      finalQuery.precio = {
        $gte: min || 0,
        $lte: max || 1000
      }
    }

    if (query.zonaGeografica) {
      finalQuery.zonaGeografica = query.zonaGeografica
    }

    if (query.estadoPaquete) {
      finalQuery.estadoPaquete = query.estadoPaquete
    }

    if (query.salidaProgramada) {
      finalQuery = {
        ...finalQuery,
        'salidaProgramada.0': { $exists: true }
      }

      const resultadoUno = await Model.find(finalQuery,
        {},
        { sort: [{ createdAt: 'desc' }] })
        .populate({
          path: 'salidaProgramada',
          match: { esEliminado: false },
          select: 'fechaSalida esEliminado',
          options: { sort: [{ createdAt: 'desc' }] }
        })
        .select('nombrePaquete precio fotoPrincipal nombreURL salidaProgramada campaniaId')

      const rango = query.salidaProgramada.split(',')
      const desde = new Date(`${rango[0]}T00:00:00.000Z`)
      const hasta = new Date(`${rango[1]}T23:59:59Z`)

      const primerFiltro = resultadoUno.filter((item) => {
        return item.salidaProgramada && item.salidaProgramada.length > 0
      })

      const nuevaLista = []

      primerFiltro.forEach(paquete => {
        const salidas = paquete.salidaProgramada
        salidas.forEach(salida => {
          if (salida.fechaSalida >= desde && salida.fechaSalida <= hasta) {
            if (!containsObject(paquete, nuevaLista)) {
              nuevaLista.push(paquete)
            }
          }
        })
      })

      return { docs: nuevaLista }
    }
    return Model.paginate(finalQuery, options)
  } catch (err) {
    console.log(err)
  }
}

const validarPaqueteTuristiPorCodigo = async (codigo) => {
  return await Model.exists({ _id: codigo })
}

const validarPrecioPorPaquete = async (montoPago, codigoPaqueteTuristico) => {
  const resultado = await Model.exists({ _id: codigoPaqueteTuristico, precio: montoPago })
  return resultado
}

const obtenerPrecioPaquetePorId = async (codigo) => {
  const resultado = await Model.findOne({ _id: codigo }).select('precio')
  return resultado
}
module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  editar,
  eliminar,
  buscar,
  validarPaqueteTuristiPorCodigo,
  validarPrecioPorPaquete,
  obtenerPrecioPaquetePorId,
  obtenerPorCampania
}
