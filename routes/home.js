const express = require('express')
const router = express.Router()
const { getHomepage, getFiles, uploadFile, deleteFile, getProfile, getIndex } = require('../controller/home')
const { getLogin, postLogin, logout, getSignup, postSignup } = require('../controller/auth')

router.get('/', getIndex) //@desc load the homepage of the website containing the authentication 
router.get('/home', getHomepage) //@desc load the homepage of the website containing contents
router.get('/files', getFiles) //@desc API {display all the files in database}
router.get('/profile', getProfile)
router.get('/login', getLogin)
router.post('/login', postLogin)
router.get('/logout', logout)
router.get('/signup', getSignup)
router.post('/signup', postSignup)
router.post('/upload', uploadFile) //@desc upload a file to the database
router.delete('/files/delete/:id', deleteFile) //@desc delete a file from the database using it's specific ID

module.exports = router