const model = require('./model')

async function addTipoDato (tipoDato) {
  const nuevoTipoDato = await new model(tipoDato)
  return nuevoTipoDato.save()
}

async function listTipoDato (codigo) {
  return await model.find(codigo)
    .sort({ _id: 'asc' })
}

async function counter (codigo) {
  try {
    return await model.find({ _id: codigo }).count({})
  } catch (error) {
    return `Error en la capa store: ${error}`
  }
}

async function updateTipoDato (codigo, tipoDato) {
  const doc_tipoDato = await model.findOne({ _id: codigo })

  for (key in tipoDato) {
    if (tipoDato[key] != '') {
      doc_tipoDato[key] = tipoDato[key]
    }
  }

  return doc_tipoDato.save()
}

async function deleteTipoDato (codigo) {
  return await model.findOneAndDelete({ _id: codigo })
}

module.exports = {
  add: addTipoDato,
  list: listTipoDato,
  count: counter,
  update: updateTipoDato,
  delete: deleteTipoDato
}
