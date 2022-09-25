const express = require('express')
const router = express.Router()
const { getHomepage, getFiles, uploadFile, deleteFile, getProfile } = require('../controller/home')

router.get('/', getHomepage) //@desc load the homepage of the website
router.get('/files', getFiles) //@desc API {display all the files in database}
router.get('/profile', getProfile)
router.post('/upload', uploadFile) //@desc upload a file to the database
router.delete('/files/delete/:id', deleteFile) //@desc delete a file from the database using it's specific ID

module.exports = router