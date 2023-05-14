const store = require('./store')

function allCampaña () {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    const campaña = await store.all()
    resolve({ results: campaña })
  })
}

function getByCampaña (search) {
  if (!search) {
    return new Promise(function (resolve, reject) {
      resolve({ results: [] })
    })
  } else {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async function (resolve, reject) {
      const campaña = await store.serach(search)
      resolve({ results: campaña })
    })
  }
}

function getById (id) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    if (Number.isNaN(parseInt(id))) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({
        codigo: 400,
        mensaje: `El código ${id} no es numérico`
      })
    } else {
      store.obtenerPorId(parseInt(id))
        .then(campaña => {
          if (campaña) {
            resolve({
              codigo: 200,
              campaña
            })
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              codigo: 404,
              mensaje: `No se encontró ninguna campaña con el código ${id}`
            })
          }
        }).catch(error => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            codigo: 500,
            mensaje: error.message
          })
        })
    }
  })
}

function addCampaña (campaña) {
  return new Promise(function (resolve, reject) {
    resolve(store.add(campaña))
  })
}

function updateCampaña (codigo, campaña) {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Datos invalidos')
      return false
    }

    resolve(store.update(codigo, campaña))
  })
}

function deleteCampaña (codigo) {
  return new Promise(function (resolve, reject) {
    if (!codigo) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Dato invalido')
      return false
    }
    resolve(store.delete({ _id: codigo }))
  })
}

module.exports = {
  allCampaña,
  addCampaña,
  getByCampaña,
  getById,
  updateCampaña,
  deleteCampaña
}
