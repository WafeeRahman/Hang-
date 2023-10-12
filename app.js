if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const mongoose = require('mongoose'); //Req Mongoose
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL;
//Connect to Mongoose and Acquire Courtground Schema
//'mongodb://127.0.0.1:27017/spot-grounds'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection; //shorthand for db

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected");
})



//Initialize Express, EJS mate and RESTful Routes

const EJSmate = require('ejs-mate'); //EJSmate -- Engine allows support for the boilerplate layout, along with partials

const express = require('express');
const session = require('express-session')

const flash = require('connect-flash') // Allows Flash Messages
const app = express();
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const spotgroundRoutes = require('./routes/spotgrounds');
const reviewRoutes = require('./routes/reviews');

const helmet = require('helmet')



app.engine('ejs', EJSmate)
app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parses Pages
app.use(methodOverride('_method')) //Overwrites HTML methods for PATCHING
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const ExpressError = require('./utilities/ExpressError')
const wrapAsync = require('./utilities/wrapAsync')


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/djgibqxxv/`, 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



const MongoStore = require('connect-mongo');
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on('error', function(error){
    console.log('MongoStore Error:',error)
} )

//Session Config and Cookies
const sessionConfig = {
    store,
    name: 'Session',
    secret: 'thisisasecret',
    resave: false,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires:Date.now() + 1000*60*60*24*7, // How many milliseconds are in a week?
        maxAge: 1000 * 60 * 60 * 24 * 7

    },
    saveUninitialized: true
    

}

app.use(session(sessionConfig)); //Initialize session with cookies
app.use(flash());

//Authentication using Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//Storing and Unstoring a User within Session
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   // console.log(req.method, req.path);
    next();
})

//Middleware for flash, passes in flash messages to response locals
// Passes flash variables, along with passport variables into every template
app.use((req,res,next) => {
    res.locals.currentUser = req.user; //Pass in user object from passport as current user (for navbar manipulation and etc.. )
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/spotgrounds', spotgroundRoutes); //Pass In Express Router to SpotGround CRUD
app.use('/spotgrounds/:id/reviews', reviewRoutes); //Pass In Review Router

app.get('/', (req, res) => {

    res.render('home'); //Render Homepage at Root 

});

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

