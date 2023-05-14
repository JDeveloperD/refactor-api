const path = require("path");
const { DIR_TEMP } = require("../../utils/upload");
const Bucket = require("../../backing/storage/google");

const uploadImages = async (data, files) => {
  const date = new Date().getTime();
  const { bannerImgH, bannerImgV } = files;

  await upload(
    bannerImgH[0].filename,
    "uploads/web/banner/desktop/",
    `${date}.jpg`
  );
  data.bannerImgH = `/uploads/web/banner/desktop/${date}.jpg`;

  await upload(
    bannerImgV[0].filename,
    "uploads/web/banner/movil/",
    `${date}.jpg`
  );
  data.bannerImgV = `/uploads/web/banner/movil/${date}.jpg`;

  // await upload(file.filename, 'uploads/web/banner/', `${date}.jpg`)
  // data.bannerImg = `/uploads/web/banner/${date}.jpg`

  return data;
};

const upload = async (fileName, destinationFolder, nameFinal) => {
  const fileTemp = path.join(DIR_TEMP, fileName);
  await Bucket.uploadFile(nameFinal, fileTemp, destinationFolder);
};

module.exports = {
  uploadImages,
  upload,
};
