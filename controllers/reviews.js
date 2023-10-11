const Review = require('../models/review')
const spotGround = require('../models/spot');


module.exports.createReview = async (req, res, next) => {


    const spot = await spotGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success', 'Review Added!')
    res.redirect(`/spotgrounds/${spot._id}`)


}


module.exports.deleteReview = async (req, res, next) => {
    const { id, revID } = req.params;

    await spotGround.findByIdAndUpdate(id, { $pull: { reviews: revID } });
    await Review.findByIdAndDelete(revID);
    req.flash('success', 'Review Deleted')
    res.redirect(`/spotgrounds/${id}`);
}