const mongoose = require('mongoose'); //Req Mongoose
const path = require('path')
const spotGround = require('./models/spot');
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




//Initialize Express and RESTful Routes

const express = require('express');
const app = express();



app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {

    res.render('home');

})



app.get('/spotgrounds', async (req, res) => {
    const spotGrounds = await spotGround.find({});
    res.render('spotgrounds/index', { spotGrounds });

})


app.listen(3000, () => {
    console.log("Listening on port 3000");
});