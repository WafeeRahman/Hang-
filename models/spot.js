const mongoose = require('mongoose');
const spotGroundSchema = require('./schemas');
const Review = require('./review');
const Schema = mongoose.Schema; //Schema Constant for Shorthand



//Schema for Court Data Model
const spotSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    thumbnail: String,
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