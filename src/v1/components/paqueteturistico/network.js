const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { archivosPaqueteTuristic } = require("../../middlewares/files");

router.get("/", async (req, res) => {
  controller
    .obtenerPaquetes()
    .then((datos) => res.json({ codigo: datos.codigo, body: datos.paquetes }))
    .catch((error) =>
      res.json({ codigo: error.codigo, mensaje: error.mensaje })
    );
});

router.get("/search", async (req, res) => {
  const query = req.query;

  controller
    .buscar(query)
    .then((datos) => res.json({ codigo: 200, body: datos.resultados }))
    .catch((error) => res.json({ codigo: 400, mensaje: error.message }));
});

router.get("/campania/:id", async (req, res) => {
  const { id } = req.params;

  controller
    .obtenerPaquetesPorCampania(id)
    .then((dato) =>
      res.status(dato.codigo).json({ codigo: dato.codigo, body: dato.paquetes })
    )
    .catch((error) =>
      res
        .status(error.codigo)
        .json({ codigo: error.codigo, mensaje: error.mensaje })
    );
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  controller
    .obtenerPaquetePorId(id)
    .then((dato) =>
      res.status(dato.codigo).json({ codigo: dato.codigo, body: dato.paquete })
    )
    .catch((error) =>
      res
        .status(error.codigo)
        .json({ codigo: error.codigo, mensaje: error.mensaje })
    );
});

router.post("/", archivosPaqueteTuristic, async (req, res) => {
  const datosPaquete = req.body;
  const archivos = req.files;

  controller
    .crearPaquete(datosPaquete, archivos)
    .then((resultado) =>
      res.status(201).json({ codigo: 201, body: resultado.paqueteCreado })
    )
    .catch((error) =>
      res
        .status(error.codigo)
        .json({ codigo: error.codigo, mensaje: error.mensaje })
    );
});

router.patch("/:id", archivosPaqueteTuristic, async (req, res) => {
  const { id } = req.params;
  const datosPaquete = req.body;
  const archivos = req.files;

  controller
    .actualizarPaquete(id, datosPaquete, archivos)
    .then((resultado) =>
      res.json({ codigo: 200, body: resultado.paqueteActualizado })
    )
    .catch((error) =>
      res.json({ codigo: error.codigo, mensaje: error.mensaje })
    );
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  controller
    .eliminarPaquete(id)
    .then((dato) => res.json({ codigo: 200, mensaje: dato.mensaje }))
    .catch((error) =>
      res.json({ codigo: error.codigo, mensaje: error.mensaje })
    );
});

module.exports = router;
