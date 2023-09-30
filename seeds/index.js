// Testing a Seed DB Function


const mongoose = require('mongoose'); //Req Mongoose
const spotGround = require('../models/spot');


//Connect to Mongoose and Acquire Courtground Schema
mongoose.connect('mongodb://127.0.0.1:27017/spot-grounds', {
    useNewUrlParser : true, 
    useUnifiedTopology: true,
});


//SeedHelpers Function
const cities = require('./cities') //pass in cities array
const {places, descriptors} = require('./seedHelpers')


const db = mongoose.connection; //shorthand for db

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected");
})


const sample = array => array[Math.floor(Math.random() * array.length)]



// Test Seeding With Random Location Data from Cities.js
const seedDB = async() => {
    
    await spotGround.deleteMany({}); //Delete All

    for (let i = 0; i <= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);

        let spot = new spotGround({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        }); 
        await spot.save(); // Create New Spot and Save
    }

}

seedDB().then(() => {
    mongoose.connection.close() //close DB
}); //Call Seed Function