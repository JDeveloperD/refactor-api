const express = require("express");
const {
  listPasajero,
  addPasajero,
  updatePasajero,
  deletePasajero,
} = require("./controller");
const response = require("../../network/response");

const router = express.Router();

// List clients

router.get("/", function (req, res) {
  console.log(req);
  const codigo = req.query.codigo;

  listPasajero(codigo)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

// Add client

router.post("/", async (req, res) => {
  await addPasajero(req.body)
    .then((data) => {
      response.success(req, res, "Pasajero Creado", 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

// Update client

router.patch("/:codigo", function (req, res) {
  updatePasajero(req.params.codigo, req.body)
    .then((data) => {
      response.success(req, res, "Pasajero Actualizado", 200);
    })
    .catch((e) => {
      response.error(req, res, "Error interno", 500, e);
    });
});

// Delete client

router.delete("/:codigo", function (req, res) {
  deletePasajero(req.params.codigo)
    .then((data) => {
      response.success(req, res, "Pasajero Eliminado", 200);
    })
    .catch((e) => {
      response.error(req, res, "Error interno", 500, e);
    });
});

module.exports = router;
