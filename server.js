const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const flash = require('express-flash')
const logger = require('morgan')
const database = require('./config/database')
const homeRoutes = require('./routes/home')
const libraryRoutes = require('./routes/library')
// const pdfRoutes = require('./routes/pdf')


// Use .env in cofig folder
require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

// connection to mongoDB
database.connectDB()

// Using EJS for views
app.set("view engine", "ejs");

//Middleware Static folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging 
app.use(logger('dev'))

// Use forms for put / delete
app.use(methodOverride('_method'))

// Setup Sessions - stored in MongDB
app.use(
    session({
        secret: 'my super secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_STRING })
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Use flash messages for errors, info, ect...
app.use(flash())

// Routes
app.use('/', homeRoutes)
app.use('/library', libraryRoutes)
// Route using my built in PDF reader
// app.use('/pdf', pdfRoutes)

// Run the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})