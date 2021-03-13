const mongoose = require('mongoose');

require('./Post');
const Post = mongoose.model('post');
const UsersSchema = new mongoose.Schema({
    email: String,
    ageUsers: Number,
    account: String,
    password: String,
    postOfUser: [{
        userId: String,
        caption: String,
        creation: Date,
        mediaUrl: String
    }]
})

mongoose.model('users', UsersSchema);