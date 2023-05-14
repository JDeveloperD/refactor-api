const fs = require('fs').promises
const multer = require('multer')

function fileStorageEngine () {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
}

async function createFolder (nombreFolder) {
  try {
    await fs.mkdir(nombreFolder)
  } catch (err) {
    console.log(`Folder already exists: ${err}`)
  }
}

async function copyFile (source, destination) {
  try {
    await fs.copyFile(source, destination)
    // console.log("aca");
    await fs.unlink(source)
  } catch (err) {
    console.log(`The file could not be copied: ${err} `)
  }
}

async function copyFotosAnexas (nombreFotosAnexasFolder, fotosAnexas) {
  try {
    await fotosAnexas.forEach(async (fotoAnexa) => {
      await copyFile(`${fotoAnexa.path}`, `${nombreFotosAnexasFolder}/${fotoAnexa.filename}`)
    })
  } catch (err) {
    console.log(`The files could not be copied: ${err}`)
  }
}

async function deleteFolder (folderId) {
  try {
    await fs.rmdir(folderId, options = { recursive: true }, (err) => {
      if (err) {
        console.log(err)
        throw err
      }
      console.log(` ${folderId} is deleted!`)
    })
  } catch (err) {
    console.log(`Delete file ${folderId}`)
  }
}

async function readFilesFromFolder (nombreFolder) {
  try {
    const files = await fs.readdir(nombreFolder)
    return files
  } catch (err) {
    console.error(err)
  }
}

async function deleteFile (nombreFile) {
  try {
    await fs.unlink(nombreFile)
  } catch (err) {
    // console.log(err)
    throw err
  }
}

const createNombreUrlPath = (nombre, codigo) => {
  const nombreUrlPath = `${codigo}-${nombre.replace(/ /g, '-').toLowerCase()}`
  nombreUrlPath.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  return nombreUrlPath
}

module.exports = {
  fileStorageEngine,
  createFolder,
  copyFile,
  copyFotosAnexas,
  deleteFolder,
  readFilesFromFolder,
  deleteFile,
  createNombreUrlPath
}
