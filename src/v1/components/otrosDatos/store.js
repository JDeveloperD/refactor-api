const model = require('./model')

async function addOtrosDatos (otrosDatos) {
  // Eliminar los datos anteriores antes de mandar los nuevos
  try {
    await model.deleteMany({ paqueteTuristico: otrosDatos.paqueteTuristico })
    const nuevoDato = await new model(otrosDatos)
    return nuevoDato.save()
  } catch (e) {
    console.log(e)
  }
}

const listarDatos = async (codigo) => {
  try {
    const doc_datos = await model
      .find(codigo)
      .populate({
        path: 'listaDatos',
        populate: { path: 'tipoDato' }
      })
    return doc_datos
  } catch (error) {
    console.log(error.message)
  }
}

const obtenerDatosPaquete = async (idPaquete) => {
  try {
    const doc_paquetes = await model.find({ paqueteTuristico: idPaquete })
    return doc_paquetes
  } catch (err) {
    return err.message
  }
}

async function counter (codigo) {
  try {
    return await model.find({ _id: codigo }).count({})
  } catch (error) {
    return `Error en la capa store: ${error}`
  }
}

async function updateOtrosDatos (codigo, otrosDatos) {
  const doc_otrosDatos = await model.findOne({ _id: codigo })

  for (key in otrosDatos) {
    if (otrosDatos[key] != '') {
      doc_otrosDatos[key] = otrosDatos[key]
    }
  }

  return doc_otrosDatos.save()
}

async function deleteOtrosDatos (codigo) {
  return await model.findOneAndDelete({ _id: codigo })
}

module.exports = {
  add: addOtrosDatos,
  list: listarDatos,
  count: counter,
  update: updateOtrosDatos,
  delete: deleteOtrosDatos,
  obtenerDatosPaquete
}

// prueba
