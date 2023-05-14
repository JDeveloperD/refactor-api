const StoreBanner = require('./store')

const create = async (req, res) => {
  const data = req.body
  const files = req.files

  const banner = await StoreBanner.addBanner(data, files)
  return res.json({ code: 201, data: banner })
}

const list = async (req, res) => {
  const data = await StoreBanner.getAll()
  return res.json({ code: 200, banners: data })
}

const remove = async (req, res) => {
  const id = req.params.id
  const actualBanners = await StoreBanner.deleteBanner(id)
  return res.json({ code: 200, existingBanners: actualBanners })
}

module.exports = {
  create,
  list,
  remove
}
