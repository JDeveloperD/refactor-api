const model = require('./model')
const { customAlphabet } = require('nanoid')

async function getAllZonasGeograficas () {
  return await model.find().select('nombreZona')
}

// Add client

function addZonaGeografica (zonaGeografica) {
  return new Promise(async (resolve, reject) => {
    const { nombreZona } = zonaGeografica
    const nanoid = customAlphabet('1234567890', 10)

    const nuevaZonaGeografica = new model({
      _id: nanoid(),
      nombreZona
    })
    await nuevaZonaGeografica.save()
    return resolve('Zona Geográfica agregada correctamente')
  })
}

// List client

async function listZonaGeografica (codigo) {
  const data = await model.findOne(codigo)

  return new Promise((resolve, reject) => {
    // si el codigo es vacio
    if (Object.keys(codigo).length === 0) {
      return resolve(model.find(codigo))
    }

    // si el codigo contiene informacion
    if (!data) {
      return reject('Código no existe')
    } else {
      return resolve(model.find(codigo))
    }
  })
}

// Update

async function updateZonaGeografica (codigo, zonaGeografica) {
  const data = await model.findOne({ _id: codigo })

  return new Promise(async function (resolve, reject) {
    if (!data) {
      return reject('No se encontró Zona Geográfica')
    } else {
      for (key in zonaGeografica) {
        data[key] = zonaGeografica[key]
      }
      await data.save()
      return resolve('Zona Geográfica Actualizada correctamente')
    }
  })
}

// delete

async function deleteZonaGeografica (codigo) {
  // await model.deleteMany({}) eliminar todos los registros

  const data = await model.findOne(codigo)

  return new Promise(async function (resolve, reject) {
    if (!data) {
      return reject('No se encontró Zona Geográfica')
    } else {
      await model.deleteOne(codigo)
      return resolve('Zona Geográfica Eliminada correctamente')
    }
  })
}

async function existeZonaGeografica (codigo) {
  return await model.exists({ _id: codigo })
}

module.exports = {
  all: getAllZonasGeograficas,
  add: addZonaGeografica,
  list: listZonaGeografica,
  update: updateZonaGeografica,
  delete: deleteZonaGeografica,
  exist: existeZonaGeografica
}
