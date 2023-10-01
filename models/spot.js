const mongoose = require('mongoose');
const Schema = mongoose.Schema; //Schema Constant for Shorthand



//Schema for Court Data Model
const spotSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    thumbnail: String

});

// Export Court Model to Make Available to Other Files
module.exports = mongoose.model('spotgrounds', spotSchema)