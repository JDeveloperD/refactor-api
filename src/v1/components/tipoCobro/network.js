const express = require("express");
const {
  listTipoCobro,
  addTipoCobro,
  updateTipoCobro,
  deleteTipoCobro,
} = require("./controller");
const response = require("../../network/response");

const router = express.Router();

// List clients

router.get("/", function (req, res) {
  console.log(req);
  const codigo = req.query.codigo;

  listTipoCobro(codigo)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

// Add client

router.post("/", async (req, res) => {
  // valida si no se le está enviando el codigo o si el objeto a actualizar es vacio
  if (Object.keys(req.body).length === 0)
    return response.error(req, res, "Error de data enviada", 500);

  await addTipoCobro(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

// Update client

router.patch("/:codigo", function (req, res) {
  // valida si no se le está enviando el codigo o si el objeto a actualizar es vacio
  if (Object.keys(req.body).length === 0)
    return response.error(req, res, "Error de data enviada", 500);

  updateTipoCobro(req.params.codigo, req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500, e);
    });
});

// Delete client

router.delete("/:codigo", function (req, res) {
  deleteTipoCobro(req.params.codigo)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

module.exports = router;
