const express = require("express");
const router = express.Router();
const response = require("../../network/response");
const smail = require("@sendgrid/mail");
const config = require("../../../config").config;
const SalidaStore = require("../salidaProgramada/store");
const moment = require("moment");

const formatDate = (date) => {
  const [d] = date.split("T");
  const [year, month, day] = d.split("-");
  return `${day}/${month}/${year}`;
};

router.post("/", async (req, res) => {
  const dataSendMail = req.body;

  smail.setApiKey("");

  const msg = {
    to: "david.sandoval@interfaz.app",
    from: "noreply@encuestasenlinea.app",
    subject: "Confirmación: Correo de prueba Cieneguilla v1.0",
    text: "Notificación: confirmación de compra",
    html: "<p>Notificación de confirmación de compra </p>", // html: '<strong>Gracias por su compra</strong><br/><br/>Da click para ver el detalle de su compra',
    template_id: "d-37691e4182d346cd888c73dc381e0fbe",
    dynamic_template_data: {
      name: "Catalina Diaz Granados",
    },
  };

  smail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      res.send("Se envio el correo satisfactoriamente");
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/mail-confirmation", async (req, res) => {
  try {
    const { salidaProgramada, name, operacion, cantidad, total, email, url } =
      req.body;

    const salida = await SalidaStore.list(salidaProgramada);
    const paquete = salida.paqueteTuristico.nombrePaquete;
    const fecha = moment(salida.fechaSalida).format("DD/MM/YYYY");

    smail.setApiKey(config.SENDGRID_API_KEY);

    const mailOptions = {
      to: email,
      cc: "reservas@cieneguillatours.com",
      from: "Cieneguilla Travel Tours<webmaster@cieneguillatours.com>",
      subject: "Notificación: Confirmación de pago",
      text: "Confirmación de pago",
      html: "<p>Notificación de confirmación de compra</p>",
      template_id: "d-511e2a2444f24476a76efef28a168007",
      dynamic_template_data: {
        paquete,
        name,
        operacion,
        fecha,
        cantidad,
        total,
        url,
      },
    };

    await smail.send(mailOptions);

    return res.json({
      code: 200,
      message: "Se envio el correo satisfactoriamente",
    });
  } catch (error) {
    return res.statusCode(500).json({ code: 500, error });
  }
});

router.post("/subscription-confirmation", async (req, res) => {
  const { name, email, url } = req.body;

  smail.setApiKey(config.SENDGRID_API_KEY);

  const mail = {
    to: email,
    cc: "marketing@cieneguillatours.com",
    from: "Cieneguilla Travel Tours<webmaster@cieneguillatours.com>",
    subject: "Notificación: confirmación de suscripción",
    text: "Confirmación de suscripción",
    html: "<p>Notificación de confirmación de suscripcion </p>", // html: '<strong>Gracias por su compra</strong><br/><br/>Da click para ver el detalle de su compra',
    template_id: "d-84c30f2b1f514b6caf0fb093e8305101",
    dynamic_template_data: {
      name,
      url,
    },
  };

  smail
    .send(mail)
    .then(() => {
      res.send("Correo enviado satisfactoriamente");
    })
    .catch((error) => {
      console.log(error, "error");
    });
});

module.exports = router;
