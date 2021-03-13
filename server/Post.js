const mongoose = require('mongoose');

const post = new mongoose.Schema({
    userId: String,
    caption: String,
    creation: String,
    mediaUrl: String
})

mongoose.model('post', post);