const spotGround = require('../models/spot');

module.exports.index = async (req, res) => {
    const spotGrounds = await spotGround.find({}); //Find all spotGrounds in DB to pass into site
    res.render('spotgrounds/index', { spotGrounds });
} // Render views/spotgrounds/index.js after await

module.exports.renderNewForm = (req, res) => {

    res.render('spotgrounds/new');

}

module.exports.createSpot = async (req, res, next) => {
    req.flash('success', 'Post Successful!')
    //if (!req.body.spotgrounds) throw new ExpressError('Invalid Data', 400) //Check for Valid Data

    const spot = new spotGround(req.body.spotgrounds); //Forms create a new spotground object
    spot.author = req.user._id;
    await spot.save(); //Save to DB
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page


}

module.exports.showSpot = async (req, res) => {
    const id = req.params.id;
    const spot = await spotGround.findById(id).populate({
        path: 'reviews',  //Populate Reviews
         populate: {
            path: 'author' //Populate Review Author
        }
    }).populate('author'); //Populate Post Author
    
    if (!spot) {
        req.flash('error', 'Spot Not Found.');
        return res.redirect('/spotgrounds');
    }
    res.render('spotgrounds/show', { spot });

}

module.exports.renderEditForm = async (req, res) => {

    const id = req.params.id;
    const spot = await spotGround.findById(id);
    if (!spot) {
        req.flash('error', 'Spot Not Found.');
        return res.redirect('/spotgrounds');
    }
   
    
    res.render('spotgrounds/edit', { spot });

}

module.exports.updateSpot = async (req, res, next) => {
    
    
    const id = req.params.id;
    const spot = await spotGround.findByIdAndUpdate(id, { ...req.body.spotgrounds }, { new: true }); // Spread req body into the database object with matching id
    req.flash('success', 'Edit Successful!')
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page

}

module.exports.deleteSpot = async (req, res) => {

    const { id } = req.params;
    const deleted = await spotGround.findByIdAndDelete(id);
    req.flash('success', 'Deleted Spot')
    res.redirect(`/spotgrounds`)




}