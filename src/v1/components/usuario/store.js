const model = require('./model')
const bcryptjs = require('bcryptjs')

// #### find: Buscar usuario ####  //

async function findUsuario(campo) {
  return await model.findOne(campo)
}

// #### List: Usuarios de sistema ####  //

async function listUsuario(codigo) {
  return await model.find(codigo)
}

// #### Count: Cantidad de usuario ####  //

async function counter(codigo) {
  try {
    return await model.find({ _id: codigo }).count({})
  } catch (error) {
    return `Error en la capa store:  ${error}`
  }
}

// #### Add: Nuevo usuario ####  //

async function addUsuario(usuario) {
  const nuevoUsuario = new model(usuario)
  const cifrado = await bcryptjs.genSalt(10)

  nuevoUsuario._id = usuario.codigo
  nuevoUsuario.password = await bcryptjs.hash(nuevoUsuario.password, cifrado)
  return nuevoUsuario.save()
}

// #### Update: Usuario ####  //

async function updateUsurio(codigo, usuario) {
  const doc_usuario = await model.findOne({ _id: codigo })

  for (key in usuario) {
    if (usuario[key] != '') {
      doc_usuario[key] = usuario[key]
    }
  }

  const cifrado = await bcryptjs.genSalt(10)
  doc_usuario.password = await bcryptjs.hash(usuario.password, cifrado)

  return doc_usuario.save()
}

// #### Delete: Eliminar usuario ####  //

async function deleteUsuario(codigo) {
  return model.deleteOne({ _id: codigo })
}

module.exports = {
  find: findUsuario,
  list: listUsuario,
  add: addUsuario,
  delete: deleteUsuario,
  count: counter,
  update: updateUsurio
}
