const express = require("express");
const {
  allZonas,
  listZonaGeografica,
  addZonaGeografica,
  updateZonaGeografica,
  deleteZonaGeografica,
} = require("./controller");
const response = require("../../network/response");

const router = express.Router();

// get all zonas
router.get("/", function (req, res) {
  allZonas()
    .then((data) => {
      response.success(req, res, data.results, 200);
    })
    .catch((err) => {
      response.error(req, res, err, 500);
    });
});

// List clients

router.get("/:codigo", function (req, res) {
  const codigo = req.query.codigo;

  listZonaGeografica(codigo)
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
  if (Object.keys(req.body).length === 0) {
    return response.error(req, res, "Error de data enviada", 500);
  }

  await addZonaGeografica(req.body)
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
  if (Object.keys(req.body).length === 0) {
    return response.error(req, res, "Error de data enviada", 500);
  }

  updateZonaGeografica(req.params.codigo, req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

// Delete client

router.delete("/:codigo", function (req, res) {
  deleteZonaGeografica(req.params.codigo)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

module.exports = router;
