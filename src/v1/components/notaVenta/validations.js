const moment = require('moment')
const {
  validarPaqueteTuristiPorCodigo
} = require('../paqueteturistico/store')

const { existeCliente } = require('../cliente/store')
const { exist } = require('../salidaProgramada/store')

moment.locale('es')

async function validacion ({ cliente, tipoCobro, fechaRegistro, fechaPago, pasajeros, masInfo, salidaProgramada }) {
  const errores = []

  if (!cliente || cliente === '' || !await esClienteValido(cliente)) {
    errores.push('El cliente no es un número o es inválido')
  }

  // if (fechaRegistro !== '' && !esFechaRegistroValido(fechaRegistro)) {
  //   errores.push('La fecha de registro es incorrecta, debe ser igual a la fecha actual')
  // }

  if (!fechaPago || !esFechaPagoValido(fechaPago)) {
    errores.push('La fecha de pago es incorrecta, debe ser igual a la fecha actual')
  }

  if (!salidaProgramada || salidaProgramada === '' || !await existeSalidaProgramada(salidaProgramada)) {
    errores.push('La salida programada no existe en la bd')
  }

  if (!pasajeros || !existenPasajeros(pasajeros)) {
    errores.push('La lista de pasajeros está vacía')
  }

  return errores
}

async function esClienteValido (codigo) {
  const result = await existeCliente(codigo)

  return result
}

function esFechaRegistroValido (fechaRegistro) {
  return moment().isSame(moment(fechaRegistro).format('YYYY-MM-DD'), 'day')
}

function esFechaPagoValido (fechaPago) {
  return moment().isSame(moment(fechaPago).format('YYYY-MM-DD'), 'day')
}

async function existePaqueteTuristico (paqueteTuristico) {
  const resultado = await validarPaqueteTuristiPorCodigo(paqueteTuristico)
  return resultado
}

async function existeSalidaProgramada (salidaProgramada) {
  const resultado = await exist(salidaProgramada)
  return resultado
}

function existenPasajeros (pasajeros) {
  return pasajeros.length > 0
}

function calcularDirefenciaEntreFechas (fecha1, fecha2, tiempo) {
  const d1 = moment(fecha1)
  const d2 = moment(fecha2)
  let diferencia

  switch (tiempo) {
    case 'days':
      diferencia = d2.diff(d1, 'days')
      break
    case 'months':
      diferencia = d2.diff(d1, 'months') % 12
      break
    default:
      break
  }

  return diferencia
}

function calcularMontoPago (numPasajeros, precio) {
  return numPasajeros * precio
}

function obtenerNumeroNotaVenta (numeroAnterior) {
  const posiciones = numeroAnterior.toString().length
  const cero = '0'
  const obtenerNumeroCeros = (8 - posiciones).toString()

  return cero.repeat(obtenerNumeroCeros) + numeroAnterior.toString()
}

module.exports = {
  validacion,
  esClienteValido,
  esFechaRegistroValido,
  esFechaPagoValido,
  existePaqueteTuristico,
  existenPasajeros,
  existeSalidaProgramada,
  calcularMontoPago,
  obtenerNumeroNotaVenta
}
