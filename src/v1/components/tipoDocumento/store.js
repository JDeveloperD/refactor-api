const model = require('./model')

const createTipoDocumento = async (tipoDocumento) => {
  const doc_tipoDocumento = await model.create(tipoDocumento)
  return doc_tipoDocumento
}

const getTipoDocumento = async (codigo) => {
  const doc_tipoDocumento = await model.findOne({ _id: codigo })
  return doc_tipoDocumento
}

const getAllTipoDocumentos = async () => {
  const docs_tipoDocumentos = await model.find({})
  return docs_tipoDocumentos
}

const updateTipoDocumento = async (codigo, tipoDocumento) => {
  const doc_tipoDocumento = await model.findOneAndUpdate({ _id: codigo }, tipoDocumento, {
    new: true,
    runValidators: true
  })
  return doc_tipoDocumento
}

const deleteTipoDocumento = async (codigo) => {
  const doc_tipoDocumento = await model.findOneAndDelete({ _id: codigo })
  return doc_tipoDocumento
}

module.exports = {
  createTipoDocumento,
  getTipoDocumento,
  getAllTipoDocumentos,
  updateTipoDocumento,
  deleteTipoDocumento
}
