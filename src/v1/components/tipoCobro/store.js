const model = require('./model')
const { customAlphabet } = require('nanoid')

// Add client

function addTipoCobro(TipoCobro) {
  return new Promise(async (resolver, rechazar) => {
    const { nombreTipoCobro } = TipoCobro
    const nanoid = customAlphabet('1234567890', 10)

    const item = new model({
      _id: nanoid(),
      nombreTipoCobro
    })
    await item.save()
    return resolver('Tipo Cobro agregado correctamente')
  })
}

// List client

async function listTipoCobro(codigo) {
  const data = await model.findOne(codigo)

  return new Promise((resolver, rechazar) => {
    // si el codigo es vacio
    if (Object.keys(codigo).length === 0) {
      return resolver(model.find(codigo))
    }

    // si el codigo contiene informacion
    if (!data) {
      return rechazar('Código no existe')
    } else {
      return resolver(model.find(codigo))
    }
  })
}

// Update

async function updateTipoCobro(codigo, TipoCobro) {
  const data = await model.findOne({ _id: codigo })

  return new Promise(async function (resolver, rechazar) {
    if (!data) {
      return rechazar('No se encontró Tipo Cobro')
    } else {
      for (key in TipoCobro) {
        data[key] = TipoCobro[key]
      }
      await data.save()
      return resolver('Tipo Cobro Actualizada correctamente')
    }
  })
}

// delete

async function deleteTipoCobro(codigo) {
  // await model.deleteMany({}) eliminar todos los registros

  const data = await model.findOne(codigo)

  return new Promise(async function (resolver, rechazar) {
    if (!data) {
      return rechazar('No se encontró Tipo Cobro')
    } else {
      await model.deleteOne(codigo)
      return resolver('Tipo Cobro Eliminado correctamente')
    }
  })
}

module.exports = {
  add: addTipoCobro,
  list: listTipoCobro,
  update: updateTipoCobro,
  delete: deleteTipoCobro
}
