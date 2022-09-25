const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Defining schema structure
const BookSchema = Schema({
    bookName: {
        type: String,
        required: true
    },
    bookFile: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    backgroundColor: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = model('Book', BookSchema)