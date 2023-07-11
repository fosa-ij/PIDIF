const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });
const User = require("../model/User");

// Init gfs bucket
const gridFSBucket = () => {
  const connection = mongoose.connection;
  return (gfsb = new mongoose.mongo.GridFSBucket(connection, {
    bucketName: "uploads",
  }));
};

module.exports = {
  // getLibraryHomepage: (req, res) => {
  //     try{
  //         gridFSBucket().find({}).toArray((err, files) => {
  //             // check if files exist
  //             if (!files || files.length === 0) {
  //                 return res.status(404).json({
  //                     err: 'No files exist'
  //                 });
  //             }
  //             res.render('home.ejs', { files: files })
  //         })
  //     } catch(err){
  //         console.error(err)
  //     }
  // },
  getAllBooks: async (req, res) => {
    try {
      gridFSBucket()
        .find()
        .toArray((err, allFiles) => {
          // check if files exist
          // if (!files || files.length === 0) {
          //     return res.status(404).json({
          //         err: 'No files exist'
          //     });
          // } else {
          ////console.log(files[files.length -1].metadata.createdAt);
          const files = allFiles.reverse()
          if (req.user){
            let userFiles = files.filter(
              (file) => file.metadata.userId === req.user.id
            );
            userFiles.map((file) => {
              if (
                file.contentType === "image/jpeg" ||
                file.contentType === "image/png" ||
                file.contentType === "image/webp"
              ) {
                file.isImage = true;
              } else {
                file.isImage = false;
              }
            });
            let imagesArr = []
            let filesArr = []
            imagesArr = userFiles.filter(files => files.isImage)
            filesArr = userFiles.filter(files => !files.isImage)
            res.render("library.ejs", { allFiles: userFiles, files: filesArr, images: imagesArr, user: req.user });
          } else {
            res.redirect('/login')
          }
          // }
        });
    } catch (err) {
      console.error(err);
    }
  },
  getBook: (req, res) => {
    try {
      gridFSBucket()
        .find({})
        .toArray((err, files) => {
          // check if files exist
          if (!files || files.length === 0) {
            return res.status(404).json({
              err: "No files exist",
            });
          }
          //> If file exist
          const file = files.filter(
            (allFiles) => allFiles.filename === req.params.filename
          );
          //// if (file[0].contentType === 'image/jpeg' || file[0].contentType === 'img/png' || file[0].contentType === 'image/webp' || file[0].contentType === 'application/pdf') {
          if (file.length) {
            // Read output to browser
            const readstream = gridFSBucket().openDownloadStreamByName(
              file[0].filename
            );
            readstream.pipe(res);
          } else {
            res.status(404).json({
              err: "Not an image",
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
  },
};
