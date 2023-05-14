const express = require("express");
const router = express.Router();
const response = require("../../network/response");
const {
  addEstadoPaquete,
  listAllEstados,
  listEstadoPaquete,
  updateEstadoPaquete,
  deleteEstadoPaquete,
} = require("./controller");

// List State

router.get("/", async (req, res) => {
  await listAllEstados()
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.get("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  await listEstadoPaquete(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

// Add State

router.post("/", async (req, res) => {
  const estadoPaquete = req.body;

  await addEstadoPaquete(estadoPaquete)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

// Update state

router.patch("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await updateEstadoPaquete(codigo, req.body)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

// Delete State

router.delete("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await deleteEstadoPaquete(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, data.message, error.code));
});

module.exports = router;
