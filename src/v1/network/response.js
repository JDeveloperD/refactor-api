const chalk = require('chalk')

exports.success = function (req, res, data = '', status) {
  if (status >= 200 && status <= 299) {
    console.log(chalk.bgGreen.black(`[Response: success / code: ${status || 200}] - ${req.method} - ${req.originalUrl}`))
  }

  return res.status(status || 200).json({
    code: status,
    body: status >= 200 && status <= 299 ? data : null
  })
}

exports.notfound = function (req, res, mensaje, status) {
  res.status(status || 404).json({
    error: mensaje
  })
}

exports.error = function (req, res, mensaje, status) {
  if (status === 404) {
    console.log(chalk.bgYellow.black(`[Response: not found / code: ${status || 500}] - ${req.method} - ${req.originalUrl}`))
  }
  if (status >= 400 && status <= 499) {
    console.log(chalk.bgYellow.black(`[Response: invalid / code: ${status || 500}] - ${req.method} - ${req.originalUrl}`))
  }
  if (status === 500) {
    console.error(chalk.bgRed.white(`[Response: error / code: ${status || 500}] - ${req.method} - ${req.originalUrl}`))
  }

  return res.status(status || 500).json({
    code: status || 500,
    error: mensaje || 'Error interno en el servidor'
  })
}
