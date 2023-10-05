const mongoose = require('mongoose'); //Req Mongoose
const path = require('path')

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



//Initialize Express, EJS mate and RESTful Routes

const EJSmate = require('ejs-mate');
const express = require('express');
const app = express();
const methodOverride = require('method-override');

const spotgrounds = require('./routes/spotgrounds')
const reviews = require('./routes/reviews')

app.engine('ejs', EJSmate)
app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parses Pages
app.use(methodOverride('_method')) //Overwrites HTML methods for PATCHING

app.use((req, res, next) => {
    console.log(req.method, req.path)
    next();
})




app.use('/spotgrounds', spotgrounds) //Pass In Express Router to SpotGround CRUD
app.use('/spotgrounds/:id/reviews', reviews) //Pass In Review Router

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

