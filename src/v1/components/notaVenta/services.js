const calcularMontoTotal = (montos) => {
  let total = 0
  montos.forEach(nota => {
    total += Number(nota.montoPago)
  })
  return total.toFixed(2)
}

const formatDate = (date) => {
  const [d] = date.split('T')
  const [year, month, day] = d.split('-')
  return `${year}-${month}-${day}`
}

function obtenerMasVendido (notasVentas) {
  let mostPopulares = []
  const obj = {}
  for (let i = 0; i < notasVentas.length; i++) {
    const paquete = notasVentas[i].salidaProgramada.paqueteTuristico
    if (obj[paquete._id]) {
      obj[paquete._id]++
    } else {
      obj[paquete._id] = 1
    }
  }

  mostPopulares = Object.entries(obj).sort((a, b) => b[1] - a[1])
  const codigoPopulares = mostPopulares.map(popular => {
    return popular[0]
  })

  return codigoPopulares
}

module.exports = {
  calcularMontoTotal,
  formatDate,
  obtenerMasVendido
}
