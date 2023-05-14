const express = require("express");
const router = express.Router();
const response = require("../../network/response");
const {
  buscarSalidas,
  addSalidaProgramada,
  obtenerTodasLasSalidas,
  obtenerSalidaProgramada,
  updateSalidaProgramada,
  deleteSalidaProgramada,
  getSalidaByPaqueteTuristico,
  buscarPaquetes,
  changeVisibility,
} = require("./controller");
const Model = require("./model");
const ModelPackage = require("../paqueteturistico/model");

router.get("/", async (req, res) => {
  obtenerTodasLasSalidas()
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.get("/search", async (req, res) => {
  const query = req.query;

  buscarSalidas(query)
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

// router.get('/search-paquete', async (req, res) => {
//   const query = req.query

//   buscarPaquetes(query)
//     .then((data) => response.success(req, res, data.results, data.code))
//     .catch((error) => response.error(req, res, error.message, error.code))
// })

router.get("/search-paquete", async (req, res) => {
  try {
    const { zonaGeografica, fechaSalida } = req.query;

    const queryMongoose = {
      visibility: true,
      esEliminado: false,
    };

    if (fechaSalida) {
      const rango = fechaSalida.split(",");
      const desde = new Date(`${rango[0]}T00:00:00.000Z`);
      const hasta = new Date(`${rango[1]}T23:59:59Z`);

      queryMongoose.fechaSalida = { $gte: desde, $lte: hasta };
    }

    Model.find(queryMongoose)
      .populate("paqueteTuristico")
      .exec((err, salidas) => {
        if (err) {
          return res.status(500).json({
            code: 500,
            error: err.message,
          });
        }

        if (zonaGeografica) {
          salidas = salidas.filter((salida) => {
            return (
              salida.paqueteTuristico.zonaGeografica === Number(zonaGeografica)
            );
          });
        }

        return res.json({
          code: 200,
          body: salidas,
        });
      });
  } catch (error) {
    return res.status(500).json({ codigo: 500, error: error.message });
  }
});

router.get("/paquete-turistico/:codigo", async (req, res) => {
  const { codigo } = req.params;
  getSalidaByPaqueteTuristico(codigo)
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.patch("/:codigo/visibility", async (req, res) => {
  const { codigo } = req.params;
  changeVisibility(codigo)
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.get("/:codigo", async (req, res) => {
  const { codigo } = req.params;

  obtenerSalidaProgramada(codigo)
    .then((data) => response.success(req, res, data.result, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.post("/", async (req, res) => {
  const data = req.body;

  addSalidaProgramada(data)
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.patch("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const data = req.body;

  updateSalidaProgramada(codigo, data)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

router.delete("/:codigo", async (req, res) => {
  const { codigo } = req.params;

  deleteSalidaProgramada(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code));
});

module.exports = router;
