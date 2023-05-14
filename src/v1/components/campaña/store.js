const { customAlphabet } = require('nanoid')
const model = require('./model')

async function getAllCampaña () {
  return await model.find()
}

function addCampaña (campaña) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const { nombreCampaña, colorButton, visibilidad } = campaña
    const nanoid = customAlphabet('1234567890', 10)

    // eslint-disable-next-line new-cap
    const nuevaCampaña = new model({
      _id: nanoid(),
      nombreCampaña,
      colorButton,
      visibilidad
    })
    await nuevaCampaña.save()
    return resolve('Campaña agregada correctamente')
  })
}

async function obtenerPorSearch (search) {
  return await model.find(
    {
      nombreCampaña: { $regex: '.*' + search + '.*', $options: 'i' }
    }
  )
}

async function obtenerPorId (id) {
  return await model.findOne({ _id: id })
}

async function updateCampaña (codigo, campaña) {
  const data = await model.findOne({ _id: codigo })

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    if (!data) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject('No se encontró la campaña')
    } else {
      // eslint-disable-next-line no-undef
      for (key in campaña) {
        // eslint-disable-next-line no-undef
        data[key] = campaña[key]
      }
      await data.save()
      return resolve('Campaña Actualizada correctamente')
    }
  })
}

async function deleteCamapaña (codigo) {
  // await model.deleteMany({}) eliminar todos los registros

  const data = await model.findOne(codigo)

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    if (!data) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject('No se encontróla campaña')
    } else {
      await model.deleteOne(codigo)
      return resolve('Campaña Eliminada correctamente')
    }
  })
}

module.exports = {
  all: getAllCampaña,
  add: addCampaña,
  serach: obtenerPorSearch,
  obtenerPorId,
  update: updateCampaña,
  delete: deleteCamapaña
}
