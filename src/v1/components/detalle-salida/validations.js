const { exist } = require('../salidaProgramada/store')

const validateCreate = async ({ salidaProgramada, details }) => {
  const errors = []

  if (!salidaProgramada || salidaProgramada === '' || !await existeSalidaProgramada(salidaProgramada)) {
    errors.push('La salida programada no existe en la bd o es incorrecta')
  }

  if (!details || details.length === 0) {
    errors.push('Por favor ingrese almenos un detalle para la salida programada')
  }

  return errors
}

async function existeSalidaProgramada (salidaProgramada) {
  return await exist(salidaProgramada)
}

module.exports = {
  validateCreate
}
