const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Defining schema structure
const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = model('User', UserSchema)