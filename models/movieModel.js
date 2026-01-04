const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    duration: {
        type: String,
        require: true
    },
    genre:{
        type: String,
        require: true 
    },
    language:{
        type: String,
        require: true
    },
    releaseDate:{
        type: Date,
        require: true 
    },
    poster:{
        type: String,
        require: true 
    }
})

module.exports = mongoose.model('movies',movieSchema);