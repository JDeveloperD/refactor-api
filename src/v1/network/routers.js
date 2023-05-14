const { Router } = require("express");
const infoPkj = require("../../../package.json");

const routerUsuarios = require("../components/usuario/network");
const routerZonasGeograficas = require("../components/zonaGeografica/network");
const routerClientes = require("../components/cliente/network");
const routerTiposDocumento = require("../components/tipoDocumento/network");
const routerTiposDato = require("../components/tipoDato/network");
const routerOtrosDatos = require("../components/otrosDatos/network");
const routerLugaresEmbarque = require("../components/lugaresEmbarque/network");
const routerEstadosPaquete = require("../components/estadoPaquete/network");
const routerEstadosVenta = require("../components/estadoVenta/network");
const routerPaquetesTuristicos = require("../components/paqueteturistico/network");
const routerSalidasProgramadas = require("../components/salidaProgramada/network");
const routerDestallesSalida = require("../components/detalle-salida/network");
const routerTiposCobro = require("../components/tipoCobro/network");
const routerNotasVenta = require("../components/notaVenta/network");
const routerReportes = require("../components/reportes/network");
const routerSendMail = require("../components/sendMail/network");
const routerTerms = require("../components/terms/network");
const routerCampaña = require("../components/campaña/network");
const routerBanner = require("../components/banner/network");

function handlerRouters(app) {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json({
      name: infoPkj.name,
      autor: infoPkj.author,
      version: infoPkj.version,
      description: infoPkj.description,
    });
  });
  /**
   * ---------------------------------------------------------
   * Registrar todas las rutas
   */
  router.use("/zonas-geograficas", routerZonasGeograficas);
  router.use("/clientes", routerClientes);
  router.use("/lugares-embarque", routerLugaresEmbarque);
  router.use("/tipos-documento", routerTiposDocumento);
  router.use("/tipos-dato", routerTiposDato);
  router.use("/otros-datos", routerOtrosDatos);
  router.use("/estados-paquete", routerEstadosPaquete);
  router.use("/estados-venta", routerEstadosVenta);
  router.use("/usuarios", routerUsuarios);
  router.use("/paquetes-turisticos", routerPaquetesTuristicos);
  router.use("/salidas-programadas", routerSalidasProgramadas);
  router.use("/detalles-salida", routerDestallesSalida);
  router.use("/tipos-cobro", routerTiposCobro);
  router.use("/notas-venta", routerNotasVenta);
  router.use("/reportes", routerReportes);
  router.use("/send-mail", routerSendMail);
  router.use("/terms", routerTerms);
  router.use("/campania", routerCampaña);
  router.use("/banners", routerBanner);

  /**
   * ---------------------------------------------------------
   */
  app.use("/api-cieneguilla-service", router);
}
module.exports = handlerRouters;
