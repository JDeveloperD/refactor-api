const store = require('./store')
const validator = require('validator')

function addEstadoVenta (estadoVenta) {
  return new Promise(async (resolver, rechazar) => {
    const { _id } = estadoVenta

    if (!estadoVenta) {
      return rechazar({ code: 400, message: 'Datos no recibidos' })
    }

    if (!validator.isNumeric(_id)) {
      return rechazar({ code: 400, message: 'El formato del código ingresado no es correcto' })
    }

    await store.add(estadoVenta)
      .then(data => {
        return resolver({ code: 200, message: data })
      })
      .catch(data => {
        return resolver({ code: 400, message: data.message })
      })
  })
}

function listEstadoVenta (estadoVenta) {
  return new Promise(async (resolver, rechazar) => {
    const { codigo } = estadoVenta

    if (!codigo) {
      return resolver({ code: 200, message: await store.list({}) })
    }

    if (!validator.isNumeric(codigo)) {
      return rechazar({ code: 400, message: 'El formato de código no es válido' })
    }

    const cantidad = await store.count(codigo)

    if (cantidad == 0) {
      return rechazar({ code: 400, message: 'Recurso no existe' })
    }

    resolver({
      code: 200,
      message: await store.list({ _id: codigo })
    })
  })
}

function updateEstadoVenta (codigo, estadoVenta) {
  return new Promise(async (resolver, rechazar) => {
    if (!codigo) {
      return rechazar({ code: 400, message: 'El campo de código es requerido' })
    }

    if (!validator.isNumeric(codigo)) {
      return rechazar({ code: 400, message: 'El formato del código ingresado no es correcto' })
    }

    const cantidad = await store.count(codigo)
    if (cantidad == 0) {
      return rechazar({ code: 404, message: 'Recurso no existe' })
    }

    store.update(codigo, estadoVenta)
      .then(data => {
        return resolver({ code: 200, message: data })
      })
      .catch(data => {
        return rechazar({ code: 400, message: data.message })
      })
  })
}

function deleteEstadoVenta (codigo) {
  return new Promise(async (resolver, rechazar) => {
    await store.delete(codigo)
      .then(data => resolver({ code: 200, message: data }))
      .catch(data => rechazar({ code: 400, message: data.message }))
  })
}

module.exports = {
  listEstadoVenta,
  addEstadoVenta,
  updateEstadoVenta,
  deleteEstadoVenta
}
