const mongoose = require('mongoose'); //Req Mongoose
const path = require('path')
const spotGround = require('./models/spot');
const Review = require('./models/review')
//Connect to Mongoose and Acquire Courtground Schema

mongoose.connect('mongodb://127.0.0.1:27017/spot-grounds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection; //shorthand for db

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected");
})

const ExpressError = require('./utilities/ExpressError')
const wrapAsync = require('./utilities/wrapAsync')
// Wrap Async try-catches all async functions, and sends error to middleware
//Express Error Handler

//Initialize Express, EJS mate and RESTful Routes

const EJSmate = require('ejs-mate');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const { spotGroundSchema, reviewSchema } = require('./models/schemas');
app.engine('ejs', EJSmate)
app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parses Pages
app.use(methodOverride('_method')) //Overwrites HTML methods for PATCHING

app.use((req, res, next) => {
    console.log(req.method, req.path)
    next();
})

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

    console.log(result);
}

//Validator For Review Schema

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400)
    }
    else {
        next();
    }
}

app.get('/', (req, res) => {

    res.render('home'); //Render Homepage at Root 

});


// Takes users to Read all SpotGrounds in DB
app.get('/spotgrounds', wrapAsync(async (req, res) => {
    const spotGrounds = await spotGround.find({});
    res.render('spotgrounds/index', { spotGrounds });

}));


// Allows users to CREATE a new page with a form that sends a POST request to the spotGROUNDS page
app.get('/spotgrounds/new', (req, res) => {

    res.render('spotgrounds/new');

});

// Allows users to CREATE a page with a post request
app.post('/spotgrounds', validateSpot, wrapAsync(async (req, res, next) => {
    //if (!req.body.spotgrounds) throw new ExpressError('Invalid Data', 400) //Check for Valid Data

    const spot = new spotGround(req.body.spotgrounds); //Forms create a new spotground object
    await spot.save(); //Save to DB
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page


}));

// Allows users to READ an existing spotGround page in more detail
app.get('/spotgrounds/:id', wrapAsync(async (req, res) => {

    const id = req.params.id;
    const spot = await spotGround.findById(id).populate('reviews');
    res.render('spotgrounds/show', { spot });

}));

// Allows users to UPDATE SpotsGrounds within the dataBase using method override and HTML put requests
app.put('/spotgrounds/:id', validateSpot, wrapAsync(async (req, res, next) => {
    if (!req.body.spotgrounds) throw new ExpressError('Invalid Data', 400)
    const id = req.params.id;
    const spot = await spotGround.findByIdAndUpdate(id, { ...req.body.spotgrounds }, { new: true }); // Spread req body into the database object with matching id
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page

}));

// Allows users to fill forms to UPDATE spotGround

app.get('/spotgrounds/:id/edit', wrapAsync(async (req, res) => {

    const id = req.params.id;
    const spot = await spotGround.findById(id);
    res.render('spotgrounds/edit', { spot });

}));

app.delete('/spotgrounds/:id', wrapAsync(async (req, res) => {

    const { id } = req.params;
    const deleted = await spotGround.findByIdAndDelete(id);
    res.redirect(`/spotgrounds`)




}));


//Post Route for Reviews, Push onto SPOT's reviews, save each object, redirect
app.post('/spotgrounds/:id/reviews', validateReview, wrapAsync(async (req, res, next) => {
    

    const spot = await spotGround.findById(req.params.id);
    const review = new Review(req.body.review);
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    res.redirect(`/spotgrounds/${spot._id}`)


}));

//Delete Route For Reviews, Deletes within spot obj, aswell as review DB
app.delete('/spotgrounds/:id/reviews/:revID', wrapAsync(async (req,res,next) => {
    const {id, revID} = req.params;
    
    await spotGround.findByIdAndUpdate(id, { $pull: {reviews: revID }});
    await Review.findByIdAndDelete(revID);
    res.redirect(`/spotgrounds/${id}`);
}));





//Error Handler Middleware

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found -- Invalid Route', 404))
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
});

