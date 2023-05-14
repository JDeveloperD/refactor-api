const express = require("express");
const router = express.Router();
const response = require("../../network/response");

const {
  addOtrosDatos,
  listarOtrosDatos,
  updateOtrosDatos,
  deleteOtrosDatos,
  obtenerDatosPorPaquete,
} = require("./controller");

router.post("/", async (req, res) => {
  const otrosDatos = req.body;

  await addOtrosDatos(otrosDatos)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.get("/", async (req, res) => {
  const codigo = req.query;

  await listarOtrosDatos(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.get("/:codigoPaquete", async (req, res) => {
  const { codigoPaquete } = req.params;

  obtenerDatosPorPaquete(codigoPaquete)
    .then((data) => response.success(req, res, data, 200))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.patch("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await updateOtrosDatos(codigo, req.body)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.delete("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await deleteOtrosDatos(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

module.exports = router;
