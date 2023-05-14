const model = require('./model')

// Add State

async function addEstadoPaquete (estadoPaquete) {
  const nuevoEstado = new model(estadoPaquete)
  // nuevoEstado._id = estadoPaquete._id
  return nuevoEstado.save()
}

async function getAllEstadoPaquete () {
  return await model.find().select('estado')
}

// List State

async function listEstadoPaquete (codigo) {
  return await model.find(codigo)
}

// Count State

async function counter (codigo) {
  try {
    return await model.find({ _id: codigo }).count({})
  } catch (error) {
    return `Error en la capa store: ${error}`
  }
}

// Update State

async function updateEstadoPaquete (codigo, estadoPaquete) {
  const doc_estadoPaquete = await model.findOne({ _id: codigo })

  for (key in estadoPaquete) {
    if (estadoPaquete[key] != '') {
      doc_estadoPaquete[key] = estadoPaquete[key]
    }
  }

  return doc_estadoPaquete.save()
}

// Delete State

async function deleteEstadoPaquete (codigo) {
  return await model.findOneAndDelete({ _id: codigo })
}
const existeEstado = async codigo => {
  return await model.exists({ _id: codigo })
}

module.exports = {
  add: addEstadoPaquete,
  list: listEstadoPaquete,
  all: getAllEstadoPaquete,
  count: counter,
  update: updateEstadoPaquete,
  delete: deleteEstadoPaquete,
  exist: existeEstado
}
