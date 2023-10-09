// Login Verification Middleware, validates if session includes a user that's logged in
const ExpressError = require('./utilities/ExpressError')
const { spotGroundSchema, reviewSchema } = require('./models/schemas');
const spotGround = require('./models/spot');
const Review = require('./models/review');
module.exports.validateLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Login Required.')
        return res.redirect('/login')
    }
    next();
}
// Stores returnTo url for logging in and returning to a specific url to be visited
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


//Function Validates All put and post requests from async functions
module.exports.validateSpot = (req, res, next) => {

    const { error } = spotGroundSchema.validate(req.body);

    //Get Different Types of Errors using JOI
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }

    console.log(res);
}
//Middleware for validating author
module.exports.validateAuthor = async (req, res, next) => {
    const { id } = req.params
    const spot = await spotGround.findById(id)
    if (!spot.author.equals(req.user._id)) { //If the requester is not the same as the author, flash an error and return to show page
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/spotgrounds/${spot._id}`)
    }
    next();
}

module.exports.validateReviewAuthor = async (req, res, next) => {
    const { id, revID } = req.params;
    const review = await Review.findById(revID)
    if (!review.author.equals(req.user._id)) { //If the requester is not the same as the author, flash an error and return to show page
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/spotgrounds/${id}`)
    }
    next();
}


//Middleware for Validating For Review Schema

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}