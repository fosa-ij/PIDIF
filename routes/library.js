const express = require('express')
const router = express.Router()
const { getLibraryHomepage, getAllBooks, getBook } = require('../controller/library')

// router.get('/', getLibraryHomepage) //@desc get the library homepage
router.get('/books', getAllBooks) //@desc API {display all the files(books/images) in database}
router.get('/books/:filename', getBook) //@desc this get and loads the actual data from the pdf / image file


module.exports = router