const mongoose = require('mongoose')
const multer = require('multer')
const database = require('../config/database')
require('dotenv').config({path: './config/.env'})

// Set multer storage engine to the newly created object
const upload = multer({ storage: database.storage }).single('file')

// Init gfs bucket
const gridFSBucket = () => {
    const connection = mongoose.connection
    return gfsb = new mongoose.mongo.GridFSBucket(connection, { 
        bucketName: 'uploads' 
    })
}

module.exports = {
    getIndex: (req, res) => {
        res.render('index.ejs')
    },
    getHomepage: (req, res) => {
        try{
            gridFSBucket().find({}).toArray((err, files) => {
                // check if files exist
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: 'No files exist'
                    });
                } else {
                    files.map(file => {
                      if (
                        file.contentType === 'image/jpeg' ||
                        file.contentType === 'image/png' ||
                        file.contentType === 'image/webp'
                      ) {
                        file.isImage = true;
                      } else {
                        file.isImage = false;
                      }
                    });
                res.render('home.ejs', { files: files })
                }
            })
        } catch(err){
            console.error(err)
        }
    },
    uploadFile: (req, res) => {
        upload(req, res, err => {
            if (err) {
                console.log('i got here errorsssss');
                return res.end(`${err}`)
            }
            // res.json({file: req.file})
            res.redirect('/library/books')
        })
    },
    getProfile: (req, res) => {
        res.render('profile.ejs', { user: req.user })
    },
    getFiles: async (req, res) => {
        try{
            gridFSBucket().find({}).toArray((err, files) => {
                // check if files exist
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: 'No files exist'
                    });
                }
                // If files exist
                return res.json(files);
            })
        } catch(err){
            console.error(err)
        }
    },
    deleteFile: (req, res) => {
        try{
            const id = req.params.id
            gridFSBucket().delete(mongoose.Types.ObjectId(id));
            res.redirect('/library/books');
        } catch(err){
            console.error(err);
        }
    }
}