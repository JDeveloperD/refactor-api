const store = require("./store");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const smail = require("@sendgrid/mail");
const config = require("../../../config").config;

function loginClient(username, password, secret) {
  return new Promise(async (resolve, reject) => {
    const cliente = await store.find({ correo: username });
    if (!cliente) return reject({ code: 401, message: "Correo inválido" });

    const match = await bcryptjs.compare(password, cliente.password);
    if (!match) return reject({ code: 401, message: "Contraseña invalida" });

    const payload = {
      user: {
        id: cliente._id,
        correo: cliente.correo,
        nombre: cliente.nombre,
        celular: cliente.celular,
        createdAt: cliente.createdAt,
      },
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    resolve({
      code: 200,
      message: { access_token: token },
    });
  });
}

function createClient(cliente) {
  return new Promise(async (resolve, reject) => {
    const { nombre, correo, _id, password } = cliente;

    if (!cliente) reject({ code: 400, message: "Datos no recibidos" });
    if (correo && !validator.isEmail(correo))
      return reject({
        code: 400,
        message: "El formato del correo ingresado no es correcto",
      });
    if (_id.length < 8)
      reject({ code: 400, message: "Verifique el número de documento" });
    if (password.length < 6)
      reject({
        code: 400,
        message: "Contraseña debe tener mínimo 6 caracteres",
      });
    if (nombre.length === 0) reject({ code: 400, message: "Ingresar nombre" });

    // Validation From DB
    const clientById = await store.find({ _id });
    const clientByCorreo = await store.find({ correo });
    if (clientById)
      reject({
        code: 400,
        message: "Número de documento se encuentra registrado",
      });
    if (clientByCorreo)
      reject({ code: 400, message: "Correo se encuentra registrado" });

    store
      .add(cliente)
      .then((data) => {
        return resolve({
          code: 200,
          message: data,
        });
      })
      .catch((data) => {
        return reject({
          code: 400,
          message: data.message,
        });
      });
  });
}

function listClients() {
  return new Promise(async (resolve, reject) => {
    store
      .obtenerTodos()
      .then((clients) => {
        resolve({
          codigo: 200,
          clients,
        });
      })
      .catch((error) => {
        reject(
          new Error({
            codigo: 500,
            mensaje: error.message,
          })
        );
      });
  });
}

function listClient(codigo) {
  return new Promise(async (resolve, reject) => {
    store
      .obtenerPorId(codigo)
      .then((client) => {
        if (client) {
          resolve({
            codigo: 200,
            client,
          });
        } else {
          reject({
            codigo: 404,
            mensaje: `No se encontró el cliente con el código ${codigo}`,
          });
        }
      })
      .catch((error) => {
        reject({
          codigo: 500,
          mensaje: error.message,
        });
      });
  });
}

function getClientByEmail(email) {
  console.log(email, "mail contr");
  return new Promise(async (resolve, reject) => {
    store
      .existeClienteByEmail(email)
      .then((client) => {
        if (client) {
          resolve({ codigo: 200, client });
        } else {
          reject({
            codigo: 404,
            mensaje: "El cliente no se encuentra regsitrado",
          });
        }
      })
      .catch((error) => {
        reject({ codigo: 500, mensaje: error.message });
      });
  });
}

async function updateClient(req, res) {
  try {
    const { codigo } = req.params;
    const client = req.body;

    if (!codigo) {
      return res.status(400).json({
        code: 400,
        message: "El campo de código es requerido",
      });
    }

    // Validar formato del código //
    if (!validator.isNumeric(codigo)) {
      return res.status(400).json({
        code: 400,
        message: "El formato del código ingresado no es correcto",
      });
    }
    // Actualizar datos de usuario //
    const clientUpdated = await store.update(codigo, client);

    if (!clientUpdated) {
      return res.status(404).json({
        code: 404,
        message: "No se encontró al cliente",
      });
    }

    return res.json({ code: 200, body: clientUpdated });

    // return res.status(200).json({})
  } catch (error) {
    return res.status(500).json({ error });
  }
}

function deleteClient(codigo) {
  return new Promise((resolve, reject) => {
    store
      .delete(codigo)
      .then((data) =>
        resolve({
          code: 200,
          message: data,
        })
      )
      .catch((data) =>
        reject({
          code: 400,
          message: data.message,
        })
      );
  });
}

function getCodeVerify(email, currentRoute, name) {
  return new Promise(async (resolve, reject) => {
    const cliente = await store.existeClienteByEmail(email);

    console.log(cliente);

    if (!cliente) {
      return reject({
        code: 404,
        message: "El email no está registrado",
      });
    }

    /**
     * obtener un código de verificación
     */
    const codigoVerificacion = uuidv4();

    /**
     * guardar el código de verificación en el cliente
     */
    await store.actualizarCodigoVerificacion(cliente._id, codigoVerificacion);

    /**
     * Enviar un código de verificación
     */
    smail.setApiKey(config.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: "Cieneguilla Travel Tours<webmaster@cieneguillatours.com>",
      subject: "Notificación: permiso para cambiar la conraseña",
      text: "Cambio de contraseña",
      html: `<strong><u>Cieneguilla Travel Tours</u></strong><p>Para cambiar tu contraseña ingresa al siguiente link: <br/><br/>${
        currentRoute + codigoVerificacion
      }</p>`, // html: '<strong>Gracias por su compra</strong><br/><br/>Da click para ver el detalle de su compra',
      template_id: "d-cd23f81220b74e3db152890fc009054a",
      dynamic_template_data: {
        name,
        url: currentRoute + codigoVerificacion,
      },
    };

    smail
      .send(msg)
      .then(() => {
        return resolve({
          code: 200,
          message:
            "Se envió un email con un link de confirmación para poder cambiar tu contraseña",
        });
      })
      .catch((error) => {
        return reject({
          code: 500,
          message: error.message,
        });
      });
  });
}

function remplacePassword(uuid, password) {
  return new Promise(async (resolve, reject) => {
    const existeCodigoVerificacion = await store.existeCodigoVerificacion(uuid);

    if (!existeCodigoVerificacion) {
      return reject({
        code: 404,
        message: "El código de verificación es incorrecto",
      });
    }

    /**
     * Actualizar contraseña
     */

    await store.actualizarPassword(existeCodigoVerificacion._id, password);

    return resolve({
      code: 200,
      message: "Se actualizó la contraseña correctamente",
    });
  });
}

function changePassword(data) {
  return new Promise(async (resolve, reject) => {
    const { dni, tipoDocumento, correo, newPassword } = data;
    if (!dni || !tipoDocumento || !correo) {
      return reject({
        code: 400,
        message: "El dni, el tipo de documento y el correo son requeridos",
      });
    }

    const cliente = await store.existeClientePorDocumento({
      dni,
      tipoDocumento,
      correo,
    });

    if (!cliente) {
      return reject({
        code: 404,
        message: "Los datos para validar el cliente son incorrectos",
      });
    }

    await store.actualizarPassword(cliente, newPassword);

    return resolve({
      code: 200,
      message: "Se actualizó la contraseña correctamente",
    });
  });
}

async function changePasswordV2(req, res) {
  try {
    return res.status(200).json({
      code: 200,
      message: "Contraseña actualizada",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = {
  createClient,
  listClient,
  updateClient,
  deleteClient,
  loginClient,
  listClients,
  getCodeVerify,
  remplacePassword,
  changePassword,
  getClientByEmail,
  changePasswordV2,
};
