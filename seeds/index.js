const spotGround = require('./models/courtground');
//Connect to Mongoose and Acquire Courtground Schema

mongoose.connect('mongodb://127.0.0.1:27017/spotgrounds', {
    useNewUrlParser : true, 
    useUnifiedTopology: true,
});


const db = mongoose.connection; //shorthand for db

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected");
})



// Test Seeding With Random Location Data from Cities.js
const seedDB = async() => {
    await spotGround.deleteMany({});
    const c = new spotGround({title:'purple field'});
    await c.save();
}