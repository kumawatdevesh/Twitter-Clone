const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('register', registerSchema);