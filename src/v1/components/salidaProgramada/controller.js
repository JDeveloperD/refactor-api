const store = require('./store')
const { validateCreate } = require('./validations')
const { Types } = require('mongoose')

function obtenerTodasLasSalidas () {
  return new Promise((resolve, reject) => {
    store.listAll()
      .then(lista => {
        return resolve({
          code: 200,
          results: lista
        })
      })
      .catch(err => {
        return reject({
          code: 500,
          message: err.message
        })
      })
  })
}
function addSalidaProgramada (data) {
  return new Promise(async (resolve, reject) => {
    // validar que las fechas sean correctas
    const errors = await validateCreate(data)

    if (errors.length > 0) {
      return reject({
        code: 400,
        message: errors
      })
    }

    store
      .add(data)
      .then((result) =>
        resolve({
          code: 201,
          data: result
        })
      )
      .catch((err) => reject({ code: 500, message: err.message }))
  })
}

function obtenerSalidaProgramada (codigo) {
  return new Promise((resolve, reject) => {
    if (!codigo || !Types.ObjectId.isValid(codigo)) {
      return reject({
        code: 400,
        message: `El código ${codigo} es erróneo`
      })
    }

    store.list(codigo)
      .then(salida => {
        if (!salida) {
          return reject({
            code: 404,
            message: `La salida programada con el código ${codigo} no existe`
          })
        }
        return resolve({
          code: 200,
          result: salida
        })
      })
      .catch(err => {
        return reject({
          code: 500,
          message: err.message
        })
      })
  })
}

function updateSalidaProgramada (codigo, salidaProgramada) {
  return new Promise(async (resolve, reject) => {
    if (!codigo || !Types.ObjectId.isValid(codigo)) {
      return reject({
        code: 400,
        message: 'El código es erróneo'
      })
    }

    const errors = validateCreate(salidaProgramada)

    if (errors.length > 0) {
      return reject({
        code: 400,
        message: errors
      })
    }

    store.update(codigo, salidaProgramada)
      .then((data) => {
        return resolve({
          code: 200,
          message: data
        })
      })
      .catch((err) => {
        return reject({
          code: 500,
          message: err.message
        })
      })
  })
}

function deleteSalidaProgramada (codigo) {
  return new Promise((resolve, reject) => {
    store
      .delete(codigo)
      .then((data) => resolve({ code: 200, message: 'La salida programada se eliminó correctamente' }))
      .catch((error) => reject({ code: 400, message: error.message }))
  })
}

function getSalidaByPaqueteTuristico (codigo) {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(parseInt(codigo))) {
      return reject({
        code: 400,
        message: `El id del paquete turístico ${codigo} no es numérico`
      })
    }

    store.listByPaquete(codigo)
      .then(data => {
        return resolve({
          code: 200,
          results: data
        })
      })
      .catch(err => reject({
        code: 500,
        message: err.message
      }))
  })
}

function buscarSalidas (query) {
  return new Promise((resolve, reject) => {
    const whiteList = [
      '_id',
      'fechaSalida',
      'fechaRetorno',
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
      .then(results => {
        resolve({
          code: 200,
          results
        })
      })
      .catch(err => {
        reject({
          codigo: 500,
          message: err.message
        })
      })
  })
}

function buscarPaquetes (query) {
  return new Promise((resolve, reject) => {
    const whiteList = [
      '_id',
      'fechaSalida',
      'zonaGeografica',
      'estadoPaquete'
    ]

    Object.getOwnPropertyNames(query).forEach(key => {
      if (!whiteList.includes(key) || query[key] === '') {
        delete query[key]
      }
    })

    // if (Object.keys(query).length === 0) {
    //   return reject(new Error('No se realizó ninguna busqueda'))
    // }

    store.buscarPaqueteByFilter(query)
      .then(results => {
        console.log(results)
        resolve({
          code: 200,
          results
        })
      })
      .catch(err => {
        reject({
          codigo: 500,
          message: err.message
        })
      })
  })
}

const changeVisibility = (id) => {
  return new Promise((resolve, reject) => {
    store.changeVisibility(id)
      .then(result => {
        resolve({
          code: 200,
          results: result
        })
      })
      .catch(err => {
        reject({
          codigo: 500,
          message: err.message
        })
      })
  })
}

module.exports = {
  buscarSalidas,
  obtenerTodasLasSalidas,
  addSalidaProgramada,
  obtenerSalidaProgramada,
  updateSalidaProgramada,
  deleteSalidaProgramada,
  getSalidaByPaqueteTuristico,
  buscarPaquetes,
  changeVisibility
}
