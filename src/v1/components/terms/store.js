const TermsModel = require('./model')

const findAll = async () => {
  return await TermsModel.find()
}

const createTerms = async (terms) => {
  await clearCollection()
  for (let index = 0; index < terms.length; index++) {
    const element = terms[index]
    await TermsModel.create(element)
  }

  return await findAll()
}

const clearCollection = async () => {
  return await TermsModel.deleteMany()
}

module.exports = {
  findAll,
  createTerms,
  clearCollection
}
