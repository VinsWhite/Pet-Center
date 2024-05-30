const mongoose = require('mongoose');

// definiamo lo schema di pet
const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: false
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        unique: false
    },
    species : {
        type: String,
        required: [true, 'Species is required'],
        unique: false
    },
    imagePath: {
        type: String
    }
    
})

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;