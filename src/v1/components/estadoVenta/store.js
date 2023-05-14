const model = require('./model')

async function addEstadoVenta (estadoVenta) {
  const nuevoEstadoVenta = await new model(estadoVenta)
  return nuevoEstadoVenta.save()
}

async function listEstadoVenta (codigo) {
  return await model.find(codigo)
}

async function counter (codigo) {
  try {
    return await model.find({ _id: codigo }).count({})
  } catch (error) {
    return `Error en la capa store: ${error}`
  }
}

async function updateEstadoVenta (codigo, estadoVenta) {
  const doc_estadoVenta = await model.findOne({ _id: codigo })

  for (key in estadoVenta) {
    if (estadoVenta[key] != '') {
      doc_estadoVenta[key] = estadoVenta[key]
    }
  }

  return doc_estadoVenta.save()
}

async function deleteEstadoVenta (codigo) {
  return await model.findOneAndDelete({ _id: codigo })
}

module.exports = {
  add: addEstadoVenta,
  list: listEstadoVenta,
  count: counter,
  update: updateEstadoVenta,
  delete: deleteEstadoVenta
}
