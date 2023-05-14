const store = require('./store')
const validator = require('validator')
const storeTipoDato = require('../tipoDato/store')

function addOtrosDatos (otrosDatos) {
  return new Promise(function (resolver, rechazar) {
    store
      .add(otrosDatos)
      .then((data) => {
        return resolver({ code: 200, message: data })
      })
      .catch((data) => {
        return rechazar({ code: 400, message: data.message })
      })
  })
}

function listarOtrosDatos (datos) {
  return new Promise(async (resolver, rechazar) => {
    const { codigo } = datos

    if (!codigo) {
      return resolver({ code: 200, message: await store.list({}) })
    }

    resolver({ code: 200, message: await store.list({ _id: codigo }) })
  })
}

function obtenerDatosPorPaquete (idPaquete) {
  return new Promise(async (resolver, rechazar) => {
    try {
      const datosPaquete = await store.obtenerDatosPaquete(idPaquete)

      const newDatosPaquete = []
      datosPaquete.forEach((item) => {
        const newListaDatos = [...item.listaDatos]
        newDatosPaquete.push(...newListaDatos)
      })
      const tiposDatos = await storeTipoDato.list()
      const copyTiposDatos = []
      tiposDatos.forEach((i) => {
        const newItem = i.toObject()
        const descriptions = []
        newItem.descriptions = descriptions
        copyTiposDatos.push(newItem)
        if (newDatosPaquete.length === 0) {
          newItem.descriptions.push('')
        }
        newDatosPaquete.forEach((j) => {
          if (i._id === j.tipoDato) {
            newItem.descriptions.push(j.descripcionDato)
          }
        })
      })

      const response = {
        tipos: copyTiposDatos
      }

      // let idTipoDato = null
      // response.tipos.forEach((item) => {
      //    if (idTipoDato !== item.tipoDato) {
      //       const arrTipoDato = [item.tipoDato]
      //       response.test.push(arrTipoDato)
      //       console.log(response, 'res')
      //    }
      //    idTipoDato = item.tipoDato
      // })
      return resolver(response)
    } catch (err) {
      return rechazar(err)
    }
  })
}

function updateOtrosDatos (codigo, otrosDatos) {
  return new Promise(async (resolver, rechazar) => {
    if (!codigo) {
      return rechazar({
        code: 400,
        message: 'El campo de código es requerido'
      })
    }

    // if (!validator.isNumeric(codigo)) {
    //    return rechazar({
    //       code: 400,
    //       message: "El formato del código ingresado no es correcto",
    //    });
    // }

    const cantidad = await store.count(codigo)
    if (cantidad == 0) {
      return rechazar({ code: 404, message: 'Recurso no existe' })
    }

    store
      .update(codigo, otrosDatos)
      .then((data) => {
        return resolver({ code: 200, message: data })
      })
      .catch((data) => {
        return rechazar({ code: 400, message: data.message })
      })
  })
}

function deleteOtrosDatos (codigo) {
  return new Promise(async (resolver, rechazar) => {
    await store
      .delete(codigo)
      .then((data) => resolver({ code: 200, message: data }))
      .catch((data) => rechazar({ code: 400, message: data.message }))
  })
}

module.exports = {
  addOtrosDatos,
  listarOtrosDatos,
  updateOtrosDatos,
  deleteOtrosDatos,
  obtenerDatosPorPaquete
}
