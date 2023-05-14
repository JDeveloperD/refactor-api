const dayjs = require("dayjs");
const { Router } = require("express");
const res = require("../../network/response");
const {
  listarNotaVentas,
  obtenerNotaVenta,
  registrarNotaVenta,
  actualizarNotaVenta,
  eliminarNotaVenta,
  actualizarPasajeros,
  obtenerNotasVentasPorFechas,
  obtenerPaquetesMasVendidos,
  obtenerDetallePorIdSalida,
  buscarNotas,
} = require("./controller");

const enrutador = Router();

enrutador.get("/", async (solicitud, respuesta) => {
  listarNotaVentas()
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.datos, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.get("/search", async (solicitud, respuesta) => {
  const query = solicitud.query;

  buscarNotas(query)
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.lista, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.get("/mas-vendidos", async (solicitud, respuesta) => {
  obtenerPaquetesMasVendidos()
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.datos, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.get("/reporte", async (solicitud, respuesta) => {
  const startDate = dayjs(solicitud.query.startDate).format();
  const endDate = dayjs(solicitud.query.endDate).format();

  obtenerNotasVentasPorFechas(startDate, endDate)
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.datos, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.get("/:codigo", async (solicitud, respuesta) => {
  const { codigo } = solicitud.params;

  obtenerNotaVenta(codigo)
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.notaVenta, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.post("/", async (solicitud, respuesta) => {
  const notaVenta = solicitud.body;

  registrarNotaVenta(notaVenta)
    .then((resultado) =>
      res.success(
        solicitud,
        respuesta,
        resultado.notaVentaCreado,
        resultado.codigo
      )
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.patch("/:codigo", async (solicitud, respuesta) => {
  const { codigo } = solicitud.params;
  const notaVenta = solicitud.body;

  actualizarNotaVenta(codigo, notaVenta)
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.notaVenta, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.delete("/:codigo", async (solicitud, respuesta) => {
  const { codigo } = solicitud.params;

  eliminarNotaVenta(codigo)
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.mensaje, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

enrutador.patch(
  "/:codigo/pasajero/:codigoPasajero",
  async (solicitud, respuesta) => {
    const pasajero = solicitud.body;
    const { codigo, codigoPasajero } = solicitud.params;

    actualizarPasajeros(codigo, codigoPasajero, pasajero)
      .then((resultado) =>
        res.success(solicitud, respuesta, resultado.pasajero, resultado.codigo)
      )
      .catch((error) =>
        res.error(solicitud, respuesta, error.mensaje, error.codigo)
      );
  }
);

enrutador.get("/salida-programada/:id", async (solicitud, respuesta) => {
  const { id } = solicitud.params;

  obtenerDetallePorIdSalida(id)
    .then((resultado) =>
      res.success(solicitud, respuesta, resultado.lista, resultado.codigo)
    )
    .catch((error) =>
      res.error(solicitud, respuesta, error.mensaje, error.codigo)
    );
});

module.exports = enrutador;
