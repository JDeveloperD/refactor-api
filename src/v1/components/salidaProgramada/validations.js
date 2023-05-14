const moment = require('moment')
const validator = require('validator')
const { validarPaqueteTuristiPorCodigo } = require('../paqueteturistico/store')

const validateCreate = async ({ fechaSalida, fechaRetorno, paqueteTuristico }) => {
  const errors = []

  if (!validator.isDate(fechaSalida) || !validator.isDate(fechaRetorno)) {
    errors.push('Verifique que las fechas estén bien escritas: format("YYYY-MM-DD")')
  } else {
    const salida = moment(fechaSalida, 'YYYY-MM-DD')
    const retorno = moment(fechaRetorno, 'YYYY-MM-DD')
    const today = moment(new Date(), 'YYYY-MM-DD')

    if (salida.isBefore(today)) {
      errors.push('La fecha de salida debe ser mayor a la fecha actual')
    }

    if (retorno.isBefore(salida)) {
      errors.push('La fecha de retorno debe ser mayor o igual que la fecha de salida')
    }
  }

  if (!paqueteTuristico || !await validarPaqueteTuristiPorCodigo(paqueteTuristico)) {
    errors.push('Por favor ingrese un código de paquete turístico correcto')
  }

  return errors
}

module.exports = {
  validateCreate
}
