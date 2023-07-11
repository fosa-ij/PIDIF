const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
// const { GridFSBucket } = require('mongodb');
require("dotenv").config({ path: "./config/.env" });

module.exports = {
  connectDB: async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_STRING, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected ${conn.connection.host}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },
  // create storage engine
  storage: new GridFsStorage({
    url: process.env.DB_STRING,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          metadata: { 
            userId: req.user.id,
            createdAt: new Date()
          },
        };
        resolve(fileInfo);
      });
    },
  }),
};
