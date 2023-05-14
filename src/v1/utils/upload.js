
const os = require('os')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const DIR_API = path.dirname(require.main.filename)
const DIR_TEMP = os.tmpdir()
// const DIR_TEMP = path.join(DIR_API, 'uploads')
const fsPromises = fs.promises

console.log(DIR_TEMP)

function fileStoreEngine () {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR_TEMP)
    },
    filename: async (req, file, cb) => {
      /**
        * El nombre del archivo está formado por el valor de la fecha actual con el id random
        */
      const nameFile = `${Date.now()}${path.extname(file.originalname)}`

      cb(null, nameFile)
    }
  })
}

const uploadTempImage = multer({
  storage: fileStoreEngine(),
  // limits: {
  //   fileSize: 1024 * 1024 * 2
  // },
  fileFilter: (req, file, cb) => {
    /**
    * @constant
    * @type {RegExp}
    */
    const regex = /jpg|jpeg|png|gif|pdf/

    /**
    * Validamos si el archivo subido cumple con el regex de imágenes
    */
    if (isSupportedFile(regex, file)) {
      cb(null, true)
    } else {
      /**
      * Si no es creamos una error con el mensaje
      */
      cb(new Error('No es un formato de imagen válida'))
    }
  }
})

/**
* Función para validar la si un archivo es compatible de acuerdo al regex que se mande
* @param {RegExp} regex
* @param {*} file
* @returns {Boolean}
*/
function isSupportedFile (regex, file) {
  const { mimetype } = file

  return regex.test(mimetype)
}

/**
  * Función remover el archivo de la carpeta temporal
  *
  * @param {string} fileName
  *
  * @returns {Promise<void>}
  */
async function deleteFileTemp (fileName) {
  const filePath = path.join(DIR_TEMP, fileName)

  await fsPromises.unlink(filePath)
}

module.exports = {
  DIR_API,
  DIR_TEMP,
  fsPromises,
  fileStoreEngine,
  uploadTempImage,
  isSupportedFile,
  deleteFileTemp
}
