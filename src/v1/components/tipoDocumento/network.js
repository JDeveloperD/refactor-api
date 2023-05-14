const express = require("express");
const {
  createTipoDocumento,
  getTipoDocumento,
  getAllTipoDocumentos,
  updateTipoDocumento,
  deleteTipoDocumento,
} = require("./controller");
const response = require("../../network/response");

const router = express.Router();

router.get("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const data = await getTipoDocumento(codigo);
  if (!data) {
    return response.notfound(
      req,
      res,
      `Tipo documento con codigo ${codigo} no existe`,
      404
    );
  }
  response.success(req, res, data, 201);
});

router.get("/", function (req, res) {
  getAllTipoDocumentos()
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

router.post("/", (req, res) => {
  createTipoDocumento(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

router.patch("/:codigo", function (req, res) {
  updateTipoDocumento(req.params.codigo, req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((e) => {
      response.error(req, res, "Error interno", 500, e);
    });
});

router.delete("/:codigo", async function (req, res) {
  const { codigo } = req.params;
  const data = await deleteTipoDocumento(codigo);
  if (!data) {
    return response.notfound(
      req,
      res,
      `Tipo documento con codigo ${codigo} no existe`,
      404
    );
  }
  response.success(req, res, data, 201);
});

module.exports = router;
