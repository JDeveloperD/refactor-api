const store = require('./store')
// const config = require('../../config').config

function addZonaGeografica (zona) {
  return new Promise(function (resolve, reject) {
    resolve(store.add(zona))
  })
}

function allZonas () {
  return new Promise(async function (resolve, reject) {
    const zonas = await store.all()
    resolve({ results: zonas })
  })
}

function listZonaGeografica (codigo) {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      resolve(store.list({}))
    }
    resolve(store.list({ _id: codigo }))
  })
}

function deleteZonaGeografica (codigo) {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      reject('Dato invalido')
      return false
    }
    resolve(store.delete({ _id: codigo }))
  })
}

function updateZonaGeografica (codigo, zonaGeografica) {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      reject('Datos invalidos')
      return false
    }

    resolve(store.update(codigo, zonaGeografica))
  })
}

module.exports = {
  allZonas,
  listZonaGeografica,
  addZonaGeografica,
  updateZonaGeografica,
  deleteZonaGeografica
}
