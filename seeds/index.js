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
    const price = Math.floor(Math.random() * 20) + 10
    for (let i = 0; i <= 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);

        let spot = new spotGround({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            thumbnail:  `https://source.unsplash.com/collection/483251`,
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur laoreet dui in leo dictum cursus. Sed a blandit urna. Morbi ultricies, ante vitae gravida consectetur`,
            price 
        }); 
        await spot.save(); // Create New Spot and Save
    }

}

seedDB().then(() => {
    mongoose.connection.close() //close DB
}); //Call Seed Function