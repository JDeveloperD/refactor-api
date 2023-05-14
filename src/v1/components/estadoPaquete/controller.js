const store = require('./store')
const validator = require('validator')

function addEstadoPaquete (estadoPaquete) {
  return new Promise(async (resolve, reject) => {
    const { _id } = estadoPaquete

    if (!_id) {
      return reject({ code: 400, message: 'Datos no recibidos' })
    }

    // if (!validator.isNumeric(_id)) {
    //   return reject({ code: 400, message: 'El formato del código ingresado no es correcto' })
    // }

    store.add(estadoPaquete)
      .then(data => {
        return resolve({ code: 200, message: data })
      })
      .catch(data => {
        return reject({ code: 400, message: data.message })
      })
  })
}

function listAllEstados () {
  return new Promise(async (resolve, reject) => {
    const estados = await store.all()
    resolve({ code: 200, results: estados })
  })
}

function listEstadoPaquete () {
  return new Promise(async (resolve, reject) => {
    const { codigo } = estadoPaquete

    if (!codigo) {
      return resolve({
        code: 200, message: await store.list({})
      })
    }

    if (!validator.isNumeric(codigo)) {
      return reject({
        code: 400, message: 'El formato de código no es válido'
      })
    }

    const cantidad = await store.count(codigo)

    if (cantidad == 0) {
      return reject({ code: 400, message: 'Recurso no existe' })
    }

    resolve({
      code: 200,
      message: await store.list({ _id: codigo })
    })
  })
}

function updateEstadoPaquete (codigo, estadoPaquete) {
  return new Promise(async (resolve, reject) => {
    if (!codigo) {
      return reject({
        code: 400,
        message: 'El campo de código es requerido'
      })
    }

    if (!validator.isNumeric(codigo)) {
      return reject({
        code: 400,
        message: 'El formato del código ingresado no es correcto'
      })
    }

    const cantidad = await store.count(codigo)
    if (cantidad == 0) {
      return reject({
        code: 404,
        message: 'Recurso no existe'
      })
    }

    store.update(codigo, estadoPaquete)
      .then(data => {
        return resolve({ code: 200, message: data })
      })
      .catch(data => {
        return reject({ code: 400, message: data.message })
      })
  })
}

function deleteEstadoPaquete (codigo) {
  return new Promise(async (resolve, reject) => {
    store.delete(codigo)
      .then(data => resolve({
        code: 200,
        message: data
      }))
      .catch(data => reject({
        code: 400,
        message: data.message
      }))
  })
}

module.exports = {
  listAllEstados,
  addEstadoPaquete,
  listEstadoPaquete,
  updateEstadoPaquete,
  deleteEstadoPaquete
}
