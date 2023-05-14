const {
  generarNombreUrl
} = require('./services')

test('Obtener el nombre url del paquete paquete', () => {
  const id = 1234234
  const nombrePaquete = 'Éste nombre tiene ñ   ``y 2 espacios [nota] (venta)||| ´}'
  const resultado = generarNombreUrl(id, nombrePaquete)
  expect(resultado).toBe('1234234-este-nombre-tiene-n-y-2-espacios-nota-venta')
})

test('Obtener el nombre url del paquete paquete churin', () => {
  const id = 98765432
  const nombrePaquete = 'Churin'
  const resultado = generarNombreUrl(id, nombrePaquete)
  expect(resultado).toBe('98765432-churin')
})
