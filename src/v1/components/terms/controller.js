const StoreTerms = require('./store')

const index = async (req, res) => {
  const data = await StoreTerms.findAll()
  return res.json({ code: 200, terms: data })
}

const create = async (req, res) => {
  const terms = req.body
  const data = await StoreTerms.createTerms(terms)
  return res.json({ code: 201, terms: data })
}

module.exports = {
  index,
  create
}
