const express = require('express');
const router = express.Router();

const ExpressError = require('../utilities/ExpressError')
const wrapAsync = require('../utilities/wrapAsync')
// Wrap Async try-catches all async functions, and sends error to middleware



const spotGround = require('../models/spot');
const { spotGroundSchema } = require('../models/schemas');
const {validateLogin} = require('../middleware') // Pass in login validation middleware
//Function Validates All put and post requests from async functions
const validateSpot = (req, res, next) => {

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


//All CRUD Routes for SpotGrounds


// Takes users to Read all SpotGrounds in DB
router.get('/', wrapAsync(async (req, res) => {
    const spotGrounds = await spotGround.find({});
    res.render('spotgrounds/index', { spotGrounds });

}));



// Allows users to CREATE a new page with a form that sends a POST request to the spotGROUNDS page
router.get('/new', validateLogin, (req, res) => {

    res.render('spotgrounds/new');

});


// Allows users to CREATE a page with a post request
router.post('/', validateLogin, validateSpot, wrapAsync(async (req, res, next) => {
    req.flash('success', 'Post Successful!')
    //if (!req.body.spotgrounds) throw new ExpressError('Invalid Data', 400) //Check for Valid Data

    const spot = new spotGround(req.body.spotgrounds); //Forms create a new spotground object
    await spot.save(); //Save to DB
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page


}));



// Allows users to UPDATE SpotsGrounds within the dataBase using method override and HTML put requests
router.put('/:id', validateLogin, validateSpot, wrapAsync(async (req, res, next) => {
    req.flash('success', 'Edit Successful!')
    const id = req.params.id;
    const spot = await spotGround.findByIdAndUpdate(id, { ...req.body.spotgrounds }, { new: true }); // Spread req body into the database object with matching id
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page

}));


// Allows users to READ an existing spotGround page in more detail
router.get('/:id', wrapAsync(async (req, res) => {
    const id = req.params.id;
    const spot = await spotGround.findById(id).populate('reviews');
    if (!spot) {
        req.flash('error', 'Spot Not Found.');
        return res.redirect('/spotgrounds');
    }
    res.render('spotgrounds/show', { spot });

}));


// Allows users to fill forms to UPDATE spotGround

router.get('/:id/edit', validateLogin, wrapAsync(async (req, res) => {

    const id = req.params.id;
    const spot = await spotGround.findById(id);
    if (!spot) {
        req.flash('error', 'Spot Not Found.');
        return res.redirect('/spotgrounds');
    }
    res.render('spotgrounds/edit', { spot });

}));

router.delete('/:id', validateLogin, wrapAsync(async (req, res) => {

    const { id } = req.params;
    const deleted = await spotGround.findByIdAndDelete(id);
    req.flash('success', 'Deleted Spot')
    res.redirect(`/spotgrounds`)




}));



module.exports = router;