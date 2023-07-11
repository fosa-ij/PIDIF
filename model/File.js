const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Defining schema structure
const FileSchema = Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { strict: false }
);

module.exports = model("File", FileSchema, "uploads.files");
