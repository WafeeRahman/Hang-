const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review')
const spotGround = require('../models/spot');
const { reviewSchema } = require('../models/schemas');
const reviews = require('../controllers/reviews') 
const ExpressError = require('../utilities/ExpressError')
const wrapAsync = require('../utilities/wrapAsync')

//Validators
const {validateLogin, validateSpot, validateAuthor, validateReview, validateReviewAuthor} = require('../middleware') 



//Post Route for Reviews, Push onto SPOT's reviews, save each object, redirect
router.post('/', validateLogin, validateReview, wrapAsync(reviews.createReview));

//Delete Route For Reviews, Deletes within spot obj, aswell as review DB
router.delete('/:revID',validateLogin, validateReviewAuthor,  wrapAsync(reviews.deleteReview));


module.exports = router;

