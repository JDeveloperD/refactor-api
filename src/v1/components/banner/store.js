// const { Bucket } = require('@google-cloud/storage')
const BannerModel = require('./model')
const { uploadImages } = require('./services')
const Bucket = require('../../backing/storage/google')

const addBanner = async (data, files) => {
  const pictures = await uploadImages(data, files)

  const bannerCreated = await BannerModel.create({
    _id: new Date().getTime(),
    ...pictures
  })

  return bannerCreated
}

const getAll = async () => {
  return await BannerModel.find()
}

const clearData = async () => {
  return await BannerModel.deleteMany()
}

const idCorrelative = async () => {
  const totalDocuments = await BannerModel.countDocuments()
  return totalDocuments + 1
}

function getBannerById (codigo) {
  return BannerModel
    .findOne({ _id: codigo })
}

const deleteBanner = async (id) => {
  const banner = await getBannerById(id)

  const imgDesktopPath = (banner.bannerImgH).split('/')
  const fileNameDesktop = imgDesktopPath[5]

  const imgMobilePath = (banner.bannerImgV).split('/')
  const fileNameMobile = imgMobilePath[5]

  await Bucket.deleteFile(`uploads/web/banner/desktop/${fileNameDesktop}`)
  await Bucket.deleteFile(`uploads/web/banner/movil/${fileNameMobile}`)

  // const imgPath = (banner.bannerImg).split('/')
  // const fileName = imgPath[4]
  // await Bucket.deleteFile(`uploads/web/banner/${fileName}`)

  await BannerModel.findOneAndDelete({ _id: id })

  return await getAll()
}

module.exports = {
  addBanner,
  getAll,
  clearData,
  idCorrelative,
  deleteBanner
}
