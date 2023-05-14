const express = require("express");
const {
  listUsuario,
  addUsuario,
  deleteUsuario,
  updateUsuario,
  loginUsuario,
} = require("./controller");
const response = require("../../network/response");

const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");
const { config } = require("../../../config");

// Basic strategy //
require("../../utils/auth/strategies/basic");
// Jwt strategy
require("../../utils/auth/strategies/jwt");

// ### Login: Usuario ### //

router.post(
  "/login",
  passport.authenticate("basic", { session: false }),
  function (req, res) {
    // res.send(req.user)
    loginUsuario(req.user.username, req.user.password, config.authJwtSecret)
      .then((data) => response.success(req, res, data.message, data.code))
      .catch((error) => response.error(req, res, error.message, error.code));
  }
);

// ### Login: Usuario ### //

router.post("/logout", function (req, res) {
  res.cookie("access_token", "", {
    expires: new Date(0),
    path: "/",
  });
});

// ### List: Usuario (como promesa) ### //

// router.get('/', async (req, res)=>{
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    const usuario = req.query;

    listUsuario(usuario)
      .then((data) => response.success(req, res, data.message, data.code))
      .catch((error) => response.error(req, res, error.message, error.code));
  }
);

// ### Add: Usuario ### //

router.post("/", async (req, res) => {
  const usuario = req.body;
  // return res.send(usuario)
  addUsuario(usuario)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

// ### Update: Usuario ### //

router.patch(
  "/:codigo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const codigo = req.params.codigo;
    // return res.send(req.body)
    updateUsuario(codigo, req.body)
      .then((data) => response.success(req, res, data.message, data.code))
      .catch((error) => response.error(req, res, error.message, error.code));
  }
);

// ### Delete: Usuario ### //

router.delete(
  "/:codigo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const codigo = req.params.codigo;
    // return res.send(codigo)
    deleteUsuario(codigo)
      .then((data) => response.success(req, res, data.message, data.code))
      .catch((error) => response.error(req, res, error.message, error.code));
  }
);

module.exports = router;
