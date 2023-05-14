const store = require('./store')
const { validacion } = require('./validations')
const { obtenerPrecioPaquetePorId } = require('../paqueteturistico/store')

const {
  obtenerPaquetePorId,
  buscar
} = require('../paqueteturistico/controller')

const { calcularMontoPago } = require('./validations')
const { calcularMontoTotal, obtenerMasVendido } = require('./services')

const listarNotaVentas = async () => {
  return new Promise((resolve, reject) => {
    store
      .obtenerTodos()
      .then((resultados) => {
        resolve({
          codigo: 200,
          datos: resultados
        })
      })
      .catch((error) => {
        reject({
          codigo: 500,
          mensaje: `Upss!!! algo salió mal, ${error.message}`
        })
      })
  })
}

const obtenerPaquetesMasVendidos = () => {
  return new Promise((resolve, reject) => {
    store
      .obtenerMasVendido()
      .then((resultados) => {
        const codigos = obtenerMasVendido(resultados)
        resolve({
          codigo: 200,
          datos: codigos
        })
      })
      .catch((error) => {
        reject({
          codigo: 500,
          mensaje: `Upss!!! algo salió mal, ${error.message}`
        })
      })
  })
}

const obtenerNotaVenta = (codigo) => {
  return new Promise((resolve, reject) => {
    store
      .obtener(codigo)
      .then((notaVenta) => {
        resolve({
          codigo: 200,
          notaVenta
        })
      })
      .catch((error) => {
        reject({
          codigo: 500,
          mensaje: `Upss!!! algo salió mal, ${error.message}`
        })
      })
  })
}

const registrarNotaVenta = (notaVenta) => {
  return new Promise(async (resolve, reject) => {
    const errores = await validacion(notaVenta)

    if (errores.length > 0) {
      return reject({
        codigo: 400,
        mensaje: errores
      })
    }

    const numeroTotalNotasVenta = await store.totalDocumentos()
    const _id = numeroTotalNotasVenta + 1

    const paqueteTuristico = await obtenerPrecioPaquetePorId(
      notaVenta.paqueteTuristico
    )

    if (!paqueteTuristico) {
      return reject({
        codigo: 400,
        mensaje: 'El paquete turístico está errado'
      })
    }

    const numeroPasajeros = notaVenta.pasajeros.length
    const montoPago = calcularMontoPago(numeroPasajeros, paqueteTuristico.precio).toFixed(
      2
    )

    const nuevoNotaVenta = {
      ...notaVenta,
      _id,
      montoPago
    }

    store
      .crear(nuevoNotaVenta)
      .then((notaVentaCreado) => {
        return resolve({
          codigo: 201,
          notaVentaCreado
        })
      })
      .catch((error) => {
        return reject({
          codigo: 500,
          mensaje: error.message
        })
      })
  })
}

const actualizarNotaVenta = (codigoNotaVenta, codigoPasajero) => {
  return new Promise((resolve, reject) => {
    store.actualizar(codigoNotaVenta, codigoPasajero).then((notaVenta) => {
      resolve({
        codigo: 200,
        notaVenta
      })
    })
  })
}

const eliminarNotaVenta = (codigo) => {
  return new Promise((resolve, reject) => {
    store
      .eliminar(codigo)
      .then((respuesta) => {
        resolve({
          codigo: 200,
          mensaje: 'se eliminó correctamente'
        })
      })
      .catch((error) => {
        reject({
          codigo: 500,
          mensaje: `Upss!!! algo salió mal, ${error.message}`
        })
      })
  })
}

const actualizarPasajeros = (codigoNotaVenta, pcodigoPasajero, pasajero) => {
  return new Promise((resolve, reject) => {
    store
      .actualizarPasajero(codigoNotaVenta, pcodigoPasajero, pasajero)
      .then((pasajeroActualizado) => {
        return resolve({
          codigo: 200,
          pasajero: pasajeroActualizado
        })
      })
      .catch((error) => {
        return reject({
          codigo: 500,
          mensaje: 'Error al actualizar pasajero'
        })
      })
  })
}

const obtenerNotasVentasPorFechas = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    store
      .notaVentaPorFecha(startDate, endDate)
      .then((resultados) => {
        const resultadosWithTotal = {
          resultados,
          montoTotal: calcularMontoTotal(resultados)
        }
        resolve({
          codigo: 200,
          datos: resultadosWithTotal
        })
      })
      .catch((error) => {
        reject({
          codigo: 500,
          mensaje: error.message
        })
      })
  })
}

const obtenerDetallePorIdSalida = (id) => {
  //
  return new Promise((resolve, reject) => {
    store
      .detalles(id)
      .then((resultado) => {
        resolve({
          codigo: 200,
          lista: resultado
        })
      })
      .catch((error) => {
        reject({
          codigo: 500,
          mensaje: error
        })
      })
  })
}

const buscarNotas = (query) => {
  return new Promise((resolve, reject) => {
    const whiteList = ['salidaProgramada']

    Object.getOwnPropertyNames(query).forEach(key => {
      if (!whiteList.includes(key) || query[key] === '') {
        delete query[key]
      }
    })

    if (Object.keys(query).length === 0) {
      return reject(new Error('No se realizó ninguna busqueda'))
    }

    store.buscar(query)
      .then(resultados => {
        resolve({
          codigo: 200,
          lista: resultados
        })
      })
      .catch(err => {
        reject({
          codigo: 500,
          mensaje: err
        })
      })
  })
}

module.exports = {
  listarNotaVentas,
  obtenerNotaVenta,
  registrarNotaVenta,
  actualizarNotaVenta,
  eliminarNotaVenta,
  actualizarPasajeros,
  obtenerNotasVentasPorFechas,
  obtenerPaquetesMasVendidos,
  obtenerDetallePorIdSalida,
  buscarNotas
}
