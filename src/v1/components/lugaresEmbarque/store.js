const model = require('./model')

const createLugarEmbarque = async (data) => {
  const lugarEmbarque = await model.create(data)
  return lugarEmbarque
}

const getLugarEmbarque = async (codigo) => {
  const lugarEmbarque = await model.findOne({ _id: codigo })
  return lugarEmbarque
}

const getAllLugaresEmbarque = async () => {
  const lugaresEmbarque = await model.find({})
  return lugaresEmbarque
}

const updateLugarEmbarque = async (codigo, data) => {
  const lugarEmbarque = await model.findOneAndUpdate({ _id: codigo }, data, {
    new: true,
    runValidators: true
  })
  return lugarEmbarque
}

const deleteLugarEmbarque = async (codigo) => {
  const lugarEmbarque = await model.findOneAndDelete({ _id: codigo })
  return lugarEmbarque
}

const existLugarEmbarque = async (id) => {

}

module.exports = {
  createLugarEmbarque,
  getLugarEmbarque,
  getAllLugaresEmbarque,
  updateLugarEmbarque,
  deleteLugarEmbarque,
  existLugarEmbarque
}
