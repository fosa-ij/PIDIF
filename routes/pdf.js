const express = require('express')
const router = express.Router()
const { getPdf } = require('../controller/pdf')

router.get('/:filename', getPdf)

module.exports = router