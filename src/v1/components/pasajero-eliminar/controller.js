const store = require('./store')
// const config = require('../../config').config

function addPasajero(pasajero) {

  return new Promise(function (resolver, rechazar) {

    if (!pasajero) {
      rechazar('No existe datos')
    }
    resolver(store.add(pasajero))
  })
}


function listPasajero(codigo) {

  return new Promise(function (resolver, rechazar) {

    if (!codigo) {
      resolver(store.list({}))
    }
    resolver(store.list({ _id: codigo }))
  })

}

function deletePasajero(codigo) {

  return new Promise(function (resolver, rechazar) {

    if (!codigo) {
      rechazar('Dato invalido')
      return false
    }
    resolver(store.delete({ _id: codigo }))
  })

}


function updatePasajero(codigo, pasajero) {

  return new Promise(function (resolver, rechazar) {

    if (!codigo) {
      rechazar('Datos invalidos')
      return false
    }

    resolver(store.update(codigo, pasajero))

  })

}


module.exports = {
  listPasajero,
  addPasajero,
  updatePasajero,
  deletePasajero
}