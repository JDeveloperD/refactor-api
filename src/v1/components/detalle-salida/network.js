const { Router } = require("express");
const router = Router();
const response = require("../../network/response");

const {
  getAll,
  getById,
  getByIdSalidaProgramada,
  getByIdLugarEmbarque,
  create,
  uptdateById,
  removeById,
} = require("./controller");
const Model = require("./model");

router.get("/", async (req, res) => {
  getAll()
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((err) => response.error(req, res, err.message, err.code));
});
router.get("/search", async (req, res) => {
  const { fechaSalida } = req.query;
  const rango = fechaSalida.split(",");
  const desde = rango[0];
  const hasta = rango[1];

  const data = await Model.find().populate({
    path: "salidaProgramada",
    match: { fechaSalida: { $gte: desde, $lte: hasta } },
  });

  res.json({
    data,
  });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  getById(id)
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((err) => response.error(req, res, err.message, err.code));
});

router.get("/salida-programada/:id", async (req, res) => {
  const { id } = req.params;
  getByIdSalidaProgramada(id)
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((err) => response.error(req, res, err.message, err.code));
});

router.get("/lugar-embarque/:id", async (req, res) => {
  const { id } = req.params;
  getByIdLugarEmbarque(id)
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((err) => response.error(req, res, err.message, err.code));
});

router.post("/", async (req, res) => {
  const data = req.body;
  create(data)
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((err) => response.error(req, res, err.message, err.code));
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  uptdateById(id)
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((err) => response.error(req, res, err.message, err.code));
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  removeById(id)
    .then((result) => response.success(req, res, result.message, result.code))
    .catch((err) => response.error(req, res, err.message, err.code));
});

module.exports = router;
