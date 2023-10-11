// Testing a Seed DB Function


const mongoose = require('mongoose'); //Req Mongoose
const spotGround = require('../models/spot');
const Review = require('../models/review');

//Connect to Mongoose and Acquire Courtground Schema
mongoose.connect('mongodb://127.0.0.1:27017/spot-grounds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


//SeedHelpers Function
const cities = require('./cities') //pass in cities array
const { places, descriptors } = require('./seedHelpers')


const db = mongoose.connection; //shorthand for db

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected");
})


const sample = array => array[Math.floor(Math.random() * array.length)]



// Test Seeding With Random Location Data from Cities.js
const seedDB = async () => {

    await spotGround.deleteMany({}); //Delete All
    await Review.deleteMany({});
    const price = Math.floor(Math.random() * 20) + 10
    for (let i = 0; i <= 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);

        let spot = new spotGround({
            author: '65231e30dd5575df8bdb04fd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]

            },
            thumbnail: [
                {

                    url: "https://res.cloudinary.com/djgibqxxv/image/upload/v1697060327/Hang/fxieuywuplxkjaamicbk.jpg",
                    filename: "Hang/eqknka5bxlemz7hzo54g"
                },
                {

                    url: "https://res.cloudinary.com/djgibqxxv/image/upload/v1696999583/Hang/vpn3p3mphuxhg1xxbjfo.png",
                    filename: "Hang/vpn3p3mphuxhg1xxbjfo"
                }
            ],
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur laoreet dui in leo dictum cursus. Sed a blandit urna. Morbi ultricies, ante vitae gravida consectetur`,
            price
        });
        await spot.save(); // Create New Spot and Save
    }

}

seedDB().then(() => {
    mongoose.connection.close() //close DB
}); //Call Seed Function