const { Router } = require('express')
const ControllerTerms = require('./controller')

const router = Router()

router.get('/', ControllerTerms.index)

router.post('/', ControllerTerms.create)

module.exports = router
