const store = require('./store')
const { validateCreate } = require('./validations')
const { Types } = require('mongoose')

const getAll = () => {
  return new Promise((resolve, reject) => {
    store.allDetalles()
      .then(data => {
        return resolve({
          code: 200,
          data: data
        })
      })
      .catch(error => {
        return reject({
          code: 500,
          message: `Error al obtener los datos ${error.message}`
        })
      })
  })
}

const getById = (id) => {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(parseInt(id))) {
      return reject({
        code: 400,
        message: `El código del detalle es incorrecto ${id}`
      })
    }

    store.getDetalleById(id)
      .then(data => {
        if (!data) {
          return reject({
            code: 404,
            message: `No existe un detalle con el código ${id}`
          })
        }
        return resolve({
          code: 200,
          data: data
        })
      })
      .catch(error => {
        return reject({
          code: 500,
          message: `Error al obtener los datos ${error.message}`
        })
      })
  })
}

const getByIdSalidaProgramada = (id) => {
  return new Promise((resolve, reject) => {
    if (!id || !Types.ObjectId.isValid(id)) {
      return reject({
        code: 400,
        message: 'El código de la salida programada es erróneo'
      })
    }
    store.getDetalleBySalidaProgramada(id)
      .then(data => {
        return resolve({
          code: 200,
          data: data
        })
      })
      .catch(error => {
        return reject({
          code: 500,
          message: `Error al obtener los datos ${error.message}`
        })
      })
  })
}

const getByIdLugarEmbarque = (id) => {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(parseInt(id))) {
      return reject({
        code: 400,
        message: `El código ${id} no es numeríco`
      })
    }

    store.getDetalleByLugarEmbarque(id)
      .then(data => {
        return resolve({
          code: 200,
          data: data
        })
      })
      .catch(error => {
        return reject({
          code: 500,
          message: `Error al obtener los datos ${error.message}`
        })
      })
  })
}

const create = (data) => {
  return new Promise(async (resolve, reject) => {
    // validamos la salida programada
    const errors = await validateCreate(data)
    if (errors.lenght > 0) {
      return reject({ code: 400, message: errors })
    }

    const { salidaProgramada, details } = data
    const results = []
    for (let i = 0; i < details.length; i++) {
      results.push(await store.register(salidaProgramada, details[i]))
    }

    return resolve({
      code: 201,
      data: results
    })
  })
}

const uptdateById = (id) => {
  return new Promise((resolve, reject) => {

  })
}

const removeById = (id) => {
  return new Promise((resolve, reject) => {
    if (Number.isNaN(parseInt(id))) {
      return reject({
        code: 400,
        message: `El código ${id} no es numérico`
      })
    }

    store.remove(parseInt(id))
      .then(resultado => {
        if (resultado) {
          resolve({
            code: 200,
            message: `Seliminó el detalle con código ${id}`
          })
        } else {
          reject({
            code: 404,
            message: `No se encontró el ningún detalle con el código ${id}`
          })
        }
      })
      .catch(error => reject({
        code: 500,
        message: error.message
      }))
  })
}

module.exports = {
  getAll,
  getById,
  getByIdSalidaProgramada,
  getByIdLugarEmbarque,
  create,
  uptdateById,
  removeById
}
