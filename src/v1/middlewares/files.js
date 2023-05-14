const { uploadTempImage } = require('../utils/upload')
const multer = require('multer')

function archivosPaqueteTuristic (req, res, next) {
  const upload = uploadTempImage.fields([
    { name: 'fotoPrincipal', maxCount: 1 },
    { name: 'archivoItinerario', maxCount: 1 },
    { name: 'anexa1', maxCount: 1 },
    { name: 'anexa2', maxCount: 1 },
    { name: 'anexa3', maxCount: 1 },
    { name: 'anexa4', maxCount: 1 }
  ])

  upload(req, res, err => {
    // errores de multer
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ codigo: 400, error: 'El sistema no permite imagenes que exceden el peso permitido de 2mb' })
      }
    }
    // errores personalizados
    if (err) {
      return res.status(500).json({ codigo: 500, error: err.message })
    }

    next()
  })
}

function archivosBanner (req, res, next) {
  const upload = uploadTempImage.single('bannerImg')

  upload(req, res, err => {
    // errores de multer
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ codigo: 400, error: 'El sistema no permite imagenes que exceden el peso permitido de 2mb' })
      }
    }
    // errores personalizados
    if (err) {
      return res.status(500).json({ codigo: 500, error: err.message })
    }

    next()
  })
}

function archivosBannerResponsive (req, res, next) {
  const upload = uploadTempImage.fields([
    { name: 'bannerImgH', maxCount: 1 },
    { name: 'bannerImgV', maxCount: 1 }
  ])

  upload(req, res, err => {
    // errores de multer
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ codigo: 400, error: 'El sistema no permite imagenes que exceden el peso permitido de 2mb' })
      }
    }
    // errores personalizados
    if (err) {
      return res.status(500).json({ codigo: 500, error: err.message })
    }

    next()
  })
}

module.exports = { archivosPaqueteTuristic, archivosBanner, archivosBannerResponsive }
