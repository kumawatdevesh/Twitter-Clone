const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tweets = new Schema({
    id: {
       type: String,
       required: true 
    },
    tweet: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('tweets', tweets);