const mongoose = require('mongoose');
const spotGroundSchema = require('./schemas');
const Review = require('./review');
const Schema = mongoose.Schema; //Schema Constant for Shorthand
const User = require('./user')


//Schema for Court Data Model
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});

const spotSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    thumbnail: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});

//Mongo MiddleWare for Reviews being Deleted Upon Spot Deletion

spotSchema.post('findOneAndDelete', async function (doc) {

    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


// Export Court Model to Make Available to Other Files
module.exports = mongoose.model('spotgrounds', spotSchema)