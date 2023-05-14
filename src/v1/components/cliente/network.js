const { Router } = require("express");
const response = require("../../network/response");
const passport = require("passport");
const { config } = require("../../../config");
const Model = require("./model");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
require("dayjs/locale/es-mx");
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.locale('es-mx')

const router = Router();

const {
  createClient,
  listClients,
  listClient,
  loginClient,
  updateClient,
  deleteClient,
  getCodeVerify,
  remplacePassword,
  changePassword,
  getClientByEmail,
  changePasswordV2,
} = require("./controller");

/**
 * Listar clientes
 */
router.get("/", async (req, res) => {
  listClients()
    .then((data) => response.success(req, res, data.clients, data.codigo))
    .catch((error) => response.error(req, res, error.mensaje, error.codigo));
});
/**
 * Obtener clientes por fecha de registro
 */
router.get("/fecha-registro", async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const start = dayjs(desde).format();
    const end = dayjs(hasta).format();

    const data = await Model.aggregate([
      {
        $project: {
          nombre: "$nombre",
          celular: "$celular",
          celularAlterno: "$celularAlterno",
          correo: "$correo",
          tipoDocumento: "$tipoDocumento",
          createdAt: {
            $dateToString: {
              date: "$createdAt".toString(),
              timezone: "America/Lima",
            },
          },
        },
      },
      {
        $match: {
          createdAt: { $gt: start, $lt: end },
        },
      },
    ]);

    return res.status(200).json({ code: 200, body: data });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
});

/**
 * Obtener un cliente por email
 */
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  getClientByEmail(email)
    .then((data) => response.success(req, res, data.client, data.codigo))
    .catch((error) => response.error(req, res, error.message, error.codigo));
});

/**
 * Obtener un cliente por id
 */
router.get("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  listClient(codigo)
    .then((data) => response.success(req, res, data.client, data.codigo))
    .catch((error) => response.error(req, res, error.message, error.codigo));
});

/**
 * obtener código de verificación
 */
router.post("/password/codigo-verificacion", async (req, res) => {
  const { email, currentRoute, nameClient } = req.body;

  getCodeVerify(email, currentRoute, nameClient)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

/**
 * obtener código de verificación
 */
router.patch("/password/reemplazar", async (req, res) => {
  const { uuid, newPassword } = req.body;

  remplacePassword(uuid, newPassword)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

/**
 * actualizar contraseña
 */
router.patch("/password/cambiar", async (req, res) => {
  const data = req.body;

  changePassword(data)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.patch("/password/cambiar-v2", changePasswordV2);

/**
 * Actualizar un cliente
 */
router.patch("/:codigo", updateClient);

/**
 * Crear un cliente
 */
router.post("/", async (req, res) => {
  const cliente = req.body;
  createClient(cliente)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

/**
 * Iniciar sesión del cliente
 */
router.post(
  "/login",
  passport.authenticate("basic", { session: false }),
  async (req, res) => {
    loginClient(req.user.username, req.user.password, config.authJwtSecret)
      .then((data) => response.success(req, res, data.message, data.code))
      .catch((error) => response.error(req, res, error.message, error.code));
  }
);

/**
 * Cerrar sesión del cliente
 */
router.post("/logout", function (req, res) {
  res.cookie("access_token", "", {
    expires: new Date(0),
    path: "/",
  });
});

/**
 * Eliminar un cliente
 */
router.delete("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  deleteClient(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});
module.exports = router;
