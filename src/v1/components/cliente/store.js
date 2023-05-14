const model = require('./model')
const bcryptjs = require('bcryptjs')

const createClient = async (client) => {
  const newClient = await model.create(client)
  const cifrado = await bcryptjs.genSalt(10)
  newClient.password = await bcryptjs.hash(newClient.password, cifrado)
  return newClient.save()
}

const listClient = async (codigo) => {
  const client = await model.find({ _id: codigo }).populate('tipoDocumento').select('nombre celular celularAlterno correo tipoDocumento codigoVerificacion createdAt')
  return client
}

const obtenerTodos = async () => {
  return await model.find({}).select('nombre celular celularAlterno correo tipoDocumento codigoVerificacion createdAt')
}

const obtenerPorId = async (codigo) => {
  return await model.find({ _id: codigo })
}

const updateClient = async (codigo, client) => {
  const clientUpdated = await model.findOneAndUpdate(
    { _id: codigo },
    client,
    {
      new: true,
      runValidation: true
    }
  ).select('-password')

  return clientUpdated
}

const deleteClient = async (codigo) => {
  const client = await model.findOneAndDelete({ _id: codigo })
  return client
}

const existeCliente = async (codigo) => {
  const result = await model.exists({ _id: codigo })
  return result
}

const existeClienteByEmail = async (email) => {
  return await model.findOne({ correo: email })
}

const actualizarCodigoVerificacion = async (codigo, codigoVerificacion) => {
  return await model.updateOne({ _id: codigo }, { codigoVerificacion }, {
    new: true,
    runValidators: true
  })
}

const existeCodigoVerificacion = async (codigoVerificacion) => {
  return await model.exists({ codigoVerificacion })
}

const existeClientePorDocumento = async ({ dni, tipoDocumento, correo }) => {
  return await model.findOne({ _id: dni, tipoDocumento, correo })
}

const actualizarPassword = async (codigo, password) => {
  const cifrado = await bcryptjs.genSalt(10)
  const passwordCifrado = await bcryptjs.hash(password, cifrado)

  return await model.updateOne({ _id: codigo }, { password: passwordCifrado, codigoVerificacion: '' }, {
    new: true,
    runValidators: true
  })
}

const existeQuery = async (query) => {
  const result = await model.exists({ query })
  return result
}

async function findClient (query) {
  return await model.findOne(query)
}

module.exports = {
  add: createClient,
  list: listClient,
  update: updateClient,
  delete: deleteClient,
  find: findClient,
  existeCliente,
  existeQuery,
  obtenerTodos,
  obtenerPorId,
  existeClienteByEmail,
  actualizarCodigoVerificacion,
  existeCodigoVerificacion,
  actualizarPassword,
  existeClientePorDocumento
}
