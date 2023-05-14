const store = require('./store')
// const config = require('../../config').config

function addTipoCobro(tipo) {

  return new Promise(function (resolver, rechazar) {

    resolver(store.add(tipo))
    
  })
}


function listTipoCobro(codigo) {

  return new Promise(function (resolver, rechazar) {

    if (!codigo) {
      resolver(store.list({}))
    }
    resolver(store.list({ _id: codigo }))
  })

}

function deleteTipoCobro(codigo) {

  return new Promise(function (resolver, rechazar) {

    if (!codigo) {
      rechazar('Dato invalido')
      return false
    }
    resolver(store.delete({ _id: codigo }))
  })

}


function updateTipoCobro(codigo, tipoCobro) {

  return new Promise(function (resolver, rechazar) {

    if (!codigo) {
      rechazar('Datos invalidos')
      return false
    }

    resolver(store.update(codigo, tipoCobro))

  })

}


module.exports = {
  listTipoCobro,
  addTipoCobro,
  updateTipoCobro,
  deleteTipoCobro
}