const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review')
const spotGround = require('../models/spot');
const { reviewSchema } = require('../models/schemas');

const ExpressError = require('../utilities/ExpressError')
const wrapAsync = require('../utilities/wrapAsync')
// Wrap Async try-catches all async functions, and sends error to middleware
//Express Error Handler



//Validator For Review Schema

const { validateReview } = require('../middleware')


//Post Route for Reviews, Push onto SPOT's reviews, save each object, redirect
router.post('/', validateReview, wrapAsync(async (req, res, next) => {


    const spot = await spotGround.findById(req.params.id);
    const review = new Review(req.body.review);
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success', 'Review Added!')
    res.redirect(`/spotgrounds/${spot._id}`)


}));

//Delete Route For Reviews, Deletes within spot obj, aswell as review DB
router.delete('/:revID', wrapAsync(async (req, res, next) => {
    const { id, revID } = req.params;

    await spotGround.findByIdAndUpdate(id, { $pull: { reviews: revID } });
    await Review.findByIdAndDelete(revID);
    req.flash('success', 'Review Deleted')
    res.redirect(`/spotgrounds/${id}`);
}));


module.exports = router;
