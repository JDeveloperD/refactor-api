const storeZona = require("../zonaGeografica/store");
const storeEstado = require("../estadoPaquete/store");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const { DIR_TEMP } = require("../../utils/upload");
const DIR_APP = path.dirname(require.main.filename);
const DIR_FILES_PAQUETE = path.join(DIR_APP, "filesPaquete");
const DIR_UPLOADS = path.join(DIR_APP, "uploads");
const Bucket = require("../../backing/storage/google");

async function validarDatosCrear({
  nombrePaquete,
  precio,
  zonaGeografica,
  estadoPaquete,
  campaniaId,
}) {
  const errors = [];

  if (!nombrePaquete || /^\s/.test(nombrePaquete)) {
    errors.push("El nombre para el paquete es inválido");
  }

  if (!zonaGeografica || !(await storeZona.exist(zonaGeografica))) {
    errors.push("El código de la zona geográfica es inválida");
  }

  if (!estadoPaquete || !(await storeEstado.exist(estadoPaquete))) {
    errors.push("El código del estado del paquete es inválido");
  }

  if (!precio) {
    errors.push("Debe ingresar un monto");
  } else {
    const precioDecimal = convertirPrecioADecimal(precio);

    if (isNaN(precioDecimal)) {
      errors.push("El monto es inválido por favor intentelo nuevamente");
    }
  }

  return errors;
}

function convertirPrecioADecimal(precio) {
  const precioSinComa = precio.replace(",", "");
  return parseFloat(precioSinComa).toFixed(2);
}

async function validarDatosEditar(
  id,
  {
    nombrePaquete,
    precio,
    zonaGeografica,
    estadoPaquete,
    salidaProgramada,
    campaniaId,
  }
) {
  const datosValidados = {};

  if (nombrePaquete) {
    datosValidados.nombrePaquete = nombrePaquete;
    datosValidados.nombreURL = generarNombreUrl(id, nombrePaquete);
  }

  if (precio) {
    const precioDecimal = convertirPrecioADecimal(precio);

    if (!isNaN(precioDecimal)) {
      datosValidados.precio = precioDecimal;
    }
  }

  if (zonaGeografica && (await storeZona.exist(zonaGeografica))) {
    datosValidados.zonaGeografica = zonaGeografica;
  }

  if (estadoPaquete && (await storeEstado.exist(estadoPaquete))) {
    datosValidados.estadoPaquete = estadoPaquete;
  }

  if (salidaProgramada) {
    datosValidados.salidaProgramada = salidaProgramada;
  }
  if (campaniaId) {
    datosValidados.campaniaId = campaniaId;
  } else {
    datosValidados.campaniaId = 0;
  }

  return datosValidados;
}

function validarImagenesYArchivos(fotoPrincipal, archivoItinerario) {
  const errors = [];

  if (fotoPrincipal === undefined) {
    errors.push("Ingrese la foto principal para el paquete turístico");
  }

  if (archivoItinerario === undefined) {
    errors.push("Ingrese el archivo itinerario para el paquete turístico");
  }

  return errors;
}

function generarNombreUrl(id, nombrePaquete) {
  let cadena = nombrePaquete.toLowerCase();
  cadena = cadena.replace(/[-[\]{}()´`*+?.,\\^$|#\s]/g, " ").trim();

  const caracteres = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const reemplazo = "aaaaaeeeeiiiioooouuuunc------";

  for (let i = 0; i < caracteres.length; i++) {
    cadena = cadena.replace(
      new RegExp(caracteres.charAt(i), "g"),
      reemplazo.charAt(i)
    );
  }

  cadena = cadena.replace(/[^a-zA-Z0-9]/g, "-");
  cadena = cadena
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${id}-${cadena}`;
}

function generarNombresImagenes(file) {
  if (file.fieldname === "archivoItinerario") {
    return "itinerario.pdf";
  }

  return file.fieldname + ".jpeg";
}

async function crearArchivosYCarpertas(id, archivos, recursive) {
  const { fotoPrincipal, archivoItinerario, anexa1, anexa2, anexa3, anexa4 } =
    archivos;
  const pathPaquete = path.join(DIR_FILES_PAQUETE, id);

  // creamos la carpeta con el nombre del id
  await fsPromises.mkdir(pathPaquete, (err) => {
    if (err) {
      // Existe el folder del paquete entonces existe y vuelve a ejecutar la función
      recursive();
    }
  });

  // copiamos los archivos desde la carpeta temporal 'upload'
  await copyFile(fotoPrincipal, pathPaquete);
  await copyFile(archivoItinerario, pathPaquete);

  // Anexas
  if (anexa1 || anexa2 || anexa3 || anexa4) {
    const pathAnexas = path.join(pathPaquete, "anexas");

    await fsPromises.mkdir(pathAnexas, (err) => {
      if (err) {
        // Existe el folder del paquete entonces existe y vuelve a ejecutar la función
        recursive();
      }
    });

    if (anexa1) {
      await copyFile(anexa1, pathAnexas);
    }

    if (anexa2) {
      await copyFile(anexa2, pathAnexas);
    }

    if (anexa3) {
      await copyFile(anexa3, pathAnexas);
    }

    if (anexa4) {
      await copyFile(anexa4, pathAnexas);
    }
  }
}

async function uploadFiles(paquete, archivos) {
  const { fotoPrincipal, archivoItinerario, anexa1, anexa2, anexa3, anexa4 } =
    archivos;

  // subir foto principal
  await foo(
    fotoPrincipal[0].filename,
    `uploads/paquetes-turisticos/${paquete._id}/`,
    "fotoPrincipal.jpg"
  );
  paquete.fotoPrincipal = `/uploads/paquetes-turisticos/${paquete._id}/fotoPrincipal.jpg`;

  // subir archivo itinerario
  await foo(
    archivoItinerario[0].filename,
    `uploads/paquetes-turisticos/${paquete._id}/`,
    "archivoItinerario.pdf"
  );
  paquete.archivoItinerario = `/uploads/paquetes-turisticos/${paquete._id}/archivoItinerario.pdf`;

  if (anexa1) {
    // subir anexa 1
    await foo(
      anexa1[0].filename,
      `uploads/paquetes-turisticos/${paquete._id}/anexas/`,
      "anexa1.jpg"
    );
  }

  if (anexa2) {
    // subir anexa 1
    await foo(
      anexa2[0].filename,
      `uploads/paquetes-turisticos/${paquete._id}/anexas/`,
      "anexa2.jpg"
    );
  }

  if (anexa3) {
    // subir anexa 1
    await foo(
      anexa3[0].filename,
      `uploads/paquetes-turisticos/${paquete._id}/anexas/`,
      "anexa3.jpg"
    );
  }

  if (anexa4) {
    // subir anexa 1
    await foo(
      anexa4[0].filename,
      `uploads/paquetes-turisticos/${paquete._id}/anexas/`,
      "anexa4.jpg"
    );
  }

  paquete.fotosAnexas = {
    anexa1: !anexa1
      ? null
      : `/uploads/paquetes-turisticos/${paquete._id}/anexas/anexa1.jpg`,
    anexa2: !anexa2
      ? null
      : `/uploads/paquetes-turisticos/${paquete._id}/anexas/anexa2.jpg`,
    anexa3: !anexa3
      ? null
      : `/uploads/paquetes-turisticos/${paquete._id}/anexas/anexa3.jpg`,
    anexa4: !anexa4
      ? null
      : `/uploads/paquetes-turisticos/${paquete._id}/anexas/anexa4.jpg`,
  };

  return paquete;
}

async function foo(fileName, destinationFolder, nameFinal) {
  const fileTmp = path.join(DIR_TEMP, fileName);

  await Bucket.uploadFile(nameFinal, fileTmp, destinationFolder);
}

async function copyFile(file, destino) {
  try {
    const src = `${DIR_UPLOADS}/${file[0].filename}`;
    const des = `${destino}/${file[0].filename}`;

    await fsPromises.copyFile(src, des);
    await fsPromises.unlink(src);
  } catch (err) {
    console.log(err);
  }
}

async function actualizarArchivosYAnexas(
  id,
  archivos,
  paquete,
  datosValidados
) {
  const { fotoPrincipal, archivoItinerario, anexa1, anexa2, anexa3, anexa4 } =
    archivos;

  if (fotoPrincipal) {
    // reemplazar el archivo
    await foo(
      fotoPrincipal[0].filename,
      `uploads/paquetes-turisticos/${id}/`,
      "fotoPrincipal.jpg"
    );
  }

  if (archivoItinerario) {
    // reemplazar el archivo
    try {
      await foo(
        archivoItinerario[0].filename,
        `uploads/paquetes-turisticos/${id}/`,
        "archivoItinerario.pdf"
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Anexas
  datosValidados.fotosAnexas = {};

  // anexas removidas
  const { removeAnexa } = paquete;

  if (typeof removeAnexa === "object") {
    removeAnexa.forEach(async (anexa) => {
      // remover anexa
      await removeFileAnexa(anexa);
    });
  } else {
    await removeFileAnexa(removeAnexa);
  }

  async function removeFileAnexa(anexa) {
    const whiteList = ["anexa1", "anexa2", "anexa3", "anexa4"];

    if (whiteList.includes(anexa)) {
      datosValidados.fotosAnexas[anexa] = null;
    }
  }

  // anexas editadas
  if (anexa1 || anexa2 || anexa3 || anexa4) {
    if (anexa1) {
      await foo(
        anexa1[0].filename,
        `uploads/paquetes-turisticos/${id}/anexas/`,
        "anexa1.jpg"
      );
      datosValidados.fotosAnexas.anexa1 = `/uploads/paquetes-turisticos/${id}/anexas/anexa1.jpg`;
    }

    if (anexa2) {
      await foo(
        anexa2[0].filename,
        `uploads/paquetes-turisticos/${id}/anexas/`,
        "anexa2.jpg"
      );
      datosValidados.fotosAnexas.anexa2 = `/uploads/paquetes-turisticos/${id}/anexas/anexa2.jpg`;
    }

    if (anexa3) {
      await foo(
        anexa3[0].filename,
        `uploads/paquetes-turisticos/${id}/anexas/`,
        "anexa3.jpg"
      );
      datosValidados.fotosAnexas.anexa3 = `/uploads/paquetes-turisticos/${id}/anexas/anexa3.jpg`;
    }

    if (anexa4) {
      await foo(
        anexa4[0].filename,
        `uploads/paquetes-turisticos/${id}/anexas/`,
        "anexa4.jpg"
      );
      datosValidados.fotosAnexas.anexa4 = `/uploads/paquetes-turisticos/${id}/anexas/anexa4.jpg`;
    }
  }

  return datosValidados;
}

function containsObject(obj, list) {
  let i;
  for (i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }

  return false;
}

module.exports = {
  validarDatosCrear,
  validarDatosEditar,
  validarImagenesYArchivos,
  generarNombreUrl,
  generarNombresImagenes,
  convertirPrecioADecimal,
  crearArchivosYCarpertas,
  actualizarArchivosYAnexas,
  containsObject,
  uploadFiles,
};
