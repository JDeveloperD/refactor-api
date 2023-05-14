const express = require("express");
const router = express.Router();
const response = require("../../network/response");
const {
  listEstadoVenta,
  addEstadoVenta,
  updateEstadoVenta,
  deleteEstadoVenta,
} = require("./controller");

router.get("/", async (req, res) => {
  const codigo = req.query;

  await listEstadoVenta(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.post("/", async (req, res) => {
  const estadoVenta = req.body;

  await addEstadoVenta(estadoVenta)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.patch("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await updateEstadoVenta(codigo, req.body)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.delete("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await deleteEstadoVenta(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

module.exports = router;
