const {
  esClienteValido,
  esFechaRegistroValido,
  calcularMontoPago,
  esFechaPagoValido,
  esMontoPagoValido,
  existePaqueteTuristico,
  existenPasajeros,
  obtenerNumeroNotaVenta
} = require('./validations')

describe('Obtener el id de la nota de venta', () => {
  test('Nota venta con 2 dígitos', () => {
    const numeroAnterior = 48
    const resultado = obtenerNumeroNotaVenta(numeroAnterior)
    expect(resultado).toBe('00000048')
  })

  test('Nota venta con 4 dígitos', () => {
    const numeroAnterior = 1000
    const resultado = obtenerNumeroNotaVenta(numeroAnterior)
    expect(resultado).toBe('00001000')
  })
})

// test('El codigo de cliente es inválido porque es un string o tiene más o menos de 8 caracteres', () => {
//    const cliente = 98765432
//    const resultado = esClienteValido(cliente)
//    expect(resultado).toBe(false)
// })

// test('El codigo de cliente no existe en la bd', () => {
//    const cliente = "98765432"
//    const resultado = esClienteValido(cliente)
//    expect(resultado).toBe(false)
// })

// test('El codigo de cliente es válido porque existe en la bd', () => {
//    const cliente = "12345678"
//    const resultado = esClienteValido(cliente)
//    expect(resultado).toBe(true)
// })

test('La fecha registro es igual a la fecha actual', () => {
  const fechaRegistro = new Date()
  const resultado = esFechaRegistroValido(fechaRegistro)
  expect(resultado).toBe(true)
})

test('La fecha registro es erronea > ó < a la fecha actual', () => {
  const fechaRegistro = new Date('2021-11-11')
  const resultado = esFechaRegistroValido(fechaRegistro)
  expect(resultado).toBe(false)
})

// test('El monto de pago es válido', () => {
//    const montoPago = 20.3
//    const resultado = esMontoPagoValido(montoPago)
//    expect(resultado).toBe(true)
// })

// test('El monto de pago es inválido porque es menor al precio de todos los paquetes registrados', () => {
//    const montoPago = 20.2
//    const resultado = esMontoPagoValido(montoPago)
//    expect(resultado).toBe(false)
// })

test('Elmonto del pago debe ser multiplo del precio del paquete turistico', () => {
  const resultado = calcularMontoPago(1, 10)
  expect(resultado).toBe(10)
})
