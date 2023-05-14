const store = require('./store')

function createTipoDocumento (tipoDoc) {
  return new Promise(function (resolve, reject) {
    if (!tipoDoc) {
      reject('No exsite datos')
    }
    resolve(store.createTipoDocumento(tipoDoc))
  })
}

function getTipoDocumento (codigo) {
  return new Promise(function (resolve, reject) {
    const data = store.getTipoDocumento(codigo)
    if (!data) {
      reject('No existe datos')
    }
    resolve(data)
  })
}

function getAllTipoDocumentos () {
  return new Promise(function (resolve, reject) {
    resolve(store.getAllTipoDocumentos())
  })
}

function updateTipoDocumento (codigo, TipoDocumento) {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      reject('Datos invalidos')
    }

    resolve(store.updateTipoDocumento(codigo, TipoDocumento))
  })
}

function deleteTipoDocumento (codigo) {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      reject('Dato invalido')
    }
    resolve(store.deleteTipoDocumento({ _id: codigo }))
  })
}

module.exports = {
  getTipoDocumento,
  getAllTipoDocumentos,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento
}
