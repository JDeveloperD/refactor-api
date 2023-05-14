const store = require('./store')

const createLugarEmbarque = (lugarEmbarque) => {
  return new Promise(function (resolve, reject) {
    if (!lugarEmbarque) {
      reject('No existe datos')
    }
    resolve(store.createLugarEmbarque(lugarEmbarque))
  })
}

const getLugarEmbarque = (codigo) => {
  return new Promise(function (resolve, reject) {
    const data = store.getLugarEmbarque(codigo)
    if (!data) {
      reject('No existe datos')
    }
    resolve(data)
  })
}

const getAllLugaresEmbarque = () => {
  return new Promise(function (resolve, reject) {
    const data = store.getAllLugaresEmbarque()
    resolve(data)
    if (!data[0]) {
      reject('No hay registros')
    }
  })
}

const updateLugarEmbarque = (codigo, lugarEmbarque) => {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      reject('No existe datos')
    }
    resolve(store.updateLugarEmbarque(codigo, lugarEmbarque))
  })
}

const deleteLugarEmbarque = (codigo) => {
  return new Promise(function (resolve, reject) {
    const data = store.deleteLugarEmbarque(codigo)
    if (!data) {
      reject('No existe datos')
    }
    resolve(data)
  })
}

module.exports = {
  createLugarEmbarque,
  getLugarEmbarque,
  getAllLugaresEmbarque,
  updateLugarEmbarque,
  deleteLugarEmbarque
}
