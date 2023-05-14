const express = require("express");
const router = express.Router();
const response = require("../../network/response");
const {
  allCampaña,
  addCampaña,
  updateCampaña,
  deleteCampaña,
  getById,
  getByCampaña,
} = require("./controller");

router.get("/", async (req, res) => {
  allCampaña()
    .then((data) => {
      response.success(req, res, data.results, 200);
    })
    .catch((err) => {
      response.error(req, res, err, 500);
    });
});

router.get("/search", async (req, res) => {
  const { search } = req.query;
  getByCampaña(search)
    .then((data) => {
      response.success(req, res, data.results, 200);
    })
    .catch((err) => {
      response.error(req, res, err, 500);
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  getById(id)
    .then((data) => {
      response.success(req, res, data.campaña, 200);
    })
    .catch((err) => {
      response.error(req, res, err, 500);
    });
});

router.post("/", async (req, res) => {
  // valida si no se le está enviando el codigo o si el objeto a actualizar es vacio
  if (Object.keys(req.body).length === 0) {
    return response.error(req, res, "Error de data enviada", 500);
  }

  await addCampaña(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

router.patch("/:codigo", async (req, res) => {
  // valida si no se le está enviando el codigo o si el objeto a actualizar es vacio
  if (Object.keys(req.body).length === 0) {
    return response.error(req, res, "Error de data enviada", 500);
  }

  updateCampaña(req.params.codigo, req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

router.delete("/:codigo", async (req, res) => {
  deleteCampaña(req.params.codigo)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch((data) => {
      response.error(req, res, data, 500);
    });
});

module.exports = router;
