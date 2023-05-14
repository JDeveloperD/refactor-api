const store = require('./store')
const validator = require('validator')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

function loginUsuario (username, password, secret) {
  return new Promise(async (resolver, rechazar) => {
    // Buscamos correo
    const usuario = await store.find({ correo: username })
    if (!usuario) return rechazar({ code: 401, message: 'Auntenticación invalida' })

    // Comparamos contraseñas
    const match = await bcryptjs.compare(password, usuario.password)
    if (!match) return rechazar({ code: 401, message: 'Auntenticación invalida' })

    // Gererar token //
    const payload = {
      user: {
        id: usuario._id,
        correo: usuario.correo
      }
    }

    const token = jwt.sign(payload, secret, { expiresIn: '1h' })

    // Retornamos token //
    resolver({
      code: 200,
      message: { access_token: token }
    })
  })
}

function listUsuario (usuario) {
  return new Promise(async (resolver, rechazar) => {
    // ### En caso se quiera validar la existencia de compo de consulta ##

    // rechazar('Hay error')

    const { codigo, correo } = usuario

    if (!codigo) {
      return resolver({
        code: 200, message: await store.list({})
      })
    }

    // if (!(/^[0-9]+$/i.test(codigo))) {
    if (!validator.isNumeric(codigo)) {
      return rechazar({ code: 400, message: 'El formato de código no es inválido' })
    }

    //    /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correo)
    if (correo && !validator.isEmail(correo)) {
      return rechazar({ code: 400, message: 'El formato del correo no es inválido' })
    }

    // Validar si usuario existe //
    const cantidad = await store.count(codigo)

    if (cantidad == 0) {
      return rechazar({ code: 404, message: 'Recurso no existe' })
    }

    resolver({
      code: 200,
      message: await store.list({ _id: codigo })
    })
  })
}

// #### Add: Usuario de sistema ####  //

function addUsuario (usuario) {
  return new Promise(async (resolver, rechazar) => {
    const { codigo, nombre, correo, celular, password } = usuario

    // Validar la existencia de los campos del usuario
    if (!usuario) rechazar({ code: 400, message: 'Datos no recibidos' })

    // Validar formato de los campos ingresados //
    if (!validator.isNumeric(codigo)) return rechazar({ code: 400, message: 'El formato del código ingresado no es correcto' })
    if (correo && !validator.isEmail(correo)) return rechazar({ code: 400, message: 'El formato del correo ingresado no es correcto' })

    store.add(usuario)
      .then(data => {
        return resolver({
          code: 200,
          message: data
        })
      }).catch(data => {
        return rechazar({
          code: 400,
          message: data.message
        })
      })

    // return resolver({
    //     code: 200,
    //     message: await store.add(usuario)
    // })
  })
}

function updateUsuario (codigo, usuario) {
  return new Promise(async (resolver, rechazar) => {
    // Validar la existencia del campo código
    if (!codigo) {
      return rechazar({
        code: 400,
        message: 'El campo de código es requerido'
      })
    }

    // Validar formato del código //
    if (!validator.isNumeric(codigo)) return rechazar({ code: 400, message: 'El formato del código ingresado no es correcto' })

    // Validar si usuario existe //
    const cantidad = await store.count(codigo)
    if (cantidad == 0) return rechazar({ code: 404, message: 'Recurso no existe' })

    // Actualizar datos de usuario //
    store.update(codigo, usuario)
      .then(data => {
        return resolver({
          code: 200,
          message: data
        })
      }).catch(data => {
        return rechazar({
          code: 400,
          message: data.message
        })
      })
  })
}

function deleteUsuario (codigo) {
  return new Promise(async (resolver, rechazar) => {
    store.delete(codigo)
      .then(data => resolver({
        code: 200,
        message: data
      }))
      .catch(data => rechazar({
        code: 400,
        message: data.message
      }))
  })
}

module.exports = {
  loginUsuario,
  listUsuario,
  addUsuario,
  updateUsuario,
  deleteUsuario
}
