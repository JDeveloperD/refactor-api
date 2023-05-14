const express = require("express");
const router = express.Router();
const response = require("../../network/response");

const {
  listTipoDato,
  addTipoDato,
  updateTipoDato,
  deleteTipoDato,
} = require("./controller");

router.get("/", async (req, res) => {
  const codigo = req.query;

  await listTipoDato(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.post("/", async (req, res) => {
  const tipoDato = req.body;

  await addTipoDato(tipoDato)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.patch("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await updateTipoDato(codigo, req.body)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.delete("/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  await deleteTipoDato(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

module.exports = router;
