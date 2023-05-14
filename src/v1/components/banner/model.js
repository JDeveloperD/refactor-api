const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Banner = Schema({
  _id: Number,
  labelButton: String,
  linkButton: String,
  bannerImgH: {
    type: String
  },
  bannerImgV: {
    type: String
  }
}, { timestamps: true })

const model = mongoose.model('Banner', Banner)

module.exports = model
