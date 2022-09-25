const express = require('express')
const app = express()
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const methodOverride = require('method-override')
const database = require('./config/database')
const homeRoutes = require('./routes/home')
const libraryRoutes = require('./routes/library')
// const pdfRoutes = require('./routes/pdf')


// Use .env in cofig folder
require('dotenv').config({path: './config/.env'})

// connection to mongoDB
database.connectDB()

//Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'))

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', homeRoutes)
app.use('/library', libraryRoutes)
// Route using my built in PDF reader
// app.use('/pdf', pdfRoutes)

// Run the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})