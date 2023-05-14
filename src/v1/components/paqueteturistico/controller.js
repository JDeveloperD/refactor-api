const store = require('./store')
const {
  validarDatosCrear,
  validarDatosEditar,
  generarNombreUrl,
  validarImagenesYArchivos,
  convertirPrecioADecimal,
  crearArchivosYCarpertas,
  uploadFiles,
  actualizarArchivosYAnexas
} = require('./services')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('123456789', 9)
const rimraf = require('rimraf')
const path = require('path')

const DIR_APP = path.dirname(require.main.filename)
const DIR_UPLOADS = path.join(DIR_APP, 'uploads')

const obtenerPaquetes = () => {
  return new Promise((resolve, reject) => {
    store.obtenerTodos()
      .then(paquetes => {
        resolve({
          codigo: 200,
          paquetes
        })
      }).catch(error => {
        reject(new Error({
          codigo: 500,
          mensaje: error.message
        }))
      })
  })
}

const obtenerPaquetePorId = (id) => {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(parseInt(id))) {
      reject({
        codigo: 400,
        mensaje: `El código ${id} no es numérico`
      })
    } else {
      store.obtenerPorId(parseInt(id))
        .then(paquete => {
          if (paquete) {
            resolve({
              codigo: 200,
              paquete
            })
          } else {
            reject({
              codigo: 404,
              mensaje: `No se encontró el ningún paquete turístico con el código ${id}`
            })
          }
        }).catch(error => {
          reject({
            codigo: 500,
            mensaje: error.message
          })
        })
    }
  })
}

const obtenerPaquetesPorCampania = (id) => {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(parseInt(id))) {
      reject({
        codigo: 400,
        mensaje: `El código ${id} no es numérico`
      })
    } else {
      store.obtenerPorCampania(parseInt(id))
        .then(paquetes => {
          resolve({
            codigo: 200,
            paquetes
          })
        }).catch(error => {
          reject({
            codigo: 500,
            mensaje: error.message
          })
        })
    }
  })
}

const crearPaquete = (paquete, archivos) => {
  return new Promise(async (resolve, reject) => {
    const { fotoPrincipal, archivoItinerario, anexa1, anexa2, anexa3, anexa4 } = archivos

    let errors = await validarDatosCrear(paquete)
    errors = errors.concat(validarImagenesYArchivos(fotoPrincipal, archivoItinerario))

    if (errors.length > 0) {
      rimraf(`${DIR_UPLOADS}/*`, function () { })

      return reject({
        codigo: 400,
        mensaje: errors
      })
    }

    paquete._id = nanoid()
    paquete.nombreURL = generarNombreUrl(paquete._id, paquete.nombrePaquete)
    paquete.precio = convertirPrecioADecimal(paquete.precio)
    if (!paquete.campaniaId) {
      paquete.campaniaId = 0
    }
    const paqueteConUrls = await uploadFiles(paquete, archivos)

    return store.crear(paqueteConUrls)
      .then(registro => {
        resolve({
          paqueteCreado: registro
        })
      }).catch(err => {
        reject({
          codigo: 400,
          mensaje: err
        })
      })
  })
}

const actualizarPaquete = (id, paquete, archivos) => {
  return new Promise(async (resolve, reject) => {
    if (Number.isNaN(parseInt(id))) {
      return reject({
        codigo: 400,
        mensaje: `El código ${id} no es numérico`
      })
    }

    let datosValidados = await validarDatosEditar(id, paquete)

    datosValidados = await actualizarArchivosYAnexas(id, archivos, paquete, datosValidados)
    store.editar(id, datosValidados)
      .then(paqueteActualizado => {
        return resolve({
          codigo: 200,
          paqueteActualizado
        })
      })
      .catch(err => {
        reject({
          codigo: 500,
          mensaje: err.message
        })
      })
  })
}

const eliminarPaquete = (id) => {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(parseInt(id))) {
      reject({
        codigo: 400,
        mensaje: `El código ${id} no es numérico`
      })
    } else {
      store.eliminar(parseInt(id))
        .then(resultado => {
          if (resultado) {
            resolve({
              mensaje: `Seliminó el paquete turístico con código ${id}`
            })
          } else {
            reject({
              codigo: 404,
              mensaje: `No se encontró el ningún paquete turístico con el código ${id}`
            })
          }
        }).catch(error => {
          reject({
            codigo: 500,
            mensaje: error.message
          })
        })
    }
  })
}

const buscar = (query) => {
  return new Promise((resolve, reject) => {
    const whiteList = [
      '_id',
      'nombrePaquete',
      'precio',
      'zonaGeografica',
      'estadoPaquete',
      'salidaProgramada',
      'limit',
      'page'
    ]

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
          code: 200,
          resultados
        })
      })
      .catch(err => {
        console.log(err)
        reject({
          codigo: 500,
          mensaje: 'error message'
        })
      })
  })
}

module.exports = {
  obtenerPaquetes,
  obtenerPaquetePorId,
  obtenerPaquetesPorCampania,
  crearPaquete,
  actualizarPaquete,
  eliminarPaquete,
  buscar
}
