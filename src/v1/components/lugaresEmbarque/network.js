const express = require("express");
const response = require("../../network/response");
const router = express.Router();
const {
  createLugarEmbarque,
  getLugarEmbarque,
  getAllLugaresEmbarque,
  updateLugarEmbarque,
  deleteLugarEmbarque,
} = require("./controller");

router.post("/", async (req, res) => {
  const data = await createLugarEmbarque(req.body);
  response.success(req, res, data, 201);
});

router.get("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const data = await getLugarEmbarque(codigo);
  if (!data) {
    return response.notfound(
      req,
      res,
      `Lugar de embarque con codigo ${codigo} no existe`,
      404
    );
  }
  response.success(req, res, data, 201);
});

router.get("/", (req, res) => {
  getAllLugaresEmbarque()
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch((err) => {
      response.notfound(req, res, err, 404);
    });
});

router.patch("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const lugarEmbarque = req.body;

  const data = await updateLugarEmbarque(codigo, lugarEmbarque);
  if (!data) {
    return response.notfound(
      req,
      res,
      `Lugar de embarque con codigo ${codigo} no existe`,
      404
    );
  }
  response.success(req, res, data, 201);
});

router.delete("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const data = await deleteLugarEmbarque(codigo);
  if (!data) {
    return response.notfound(
      req,
      res,
      `Lugar de embarque con codigo ${codigo} no existe`,
      404
    );
  }
  response.success(req, res, data, 201);
});

module.exports = router;
