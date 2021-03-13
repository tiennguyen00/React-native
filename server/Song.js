const mongoose = require('mongoose');
const SongSchema = new mongoose.Schema({
    nameSong: String,
    namePerformer: String,
    image: String,
    mp4: String
})

mongoose.model('song', SongSchema);