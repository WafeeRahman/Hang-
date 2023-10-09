// Login Verification Middleware, validates if session includes a user that's logged in
module.exports.validateLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Login Required.')
        return res.redirect('/login')
    }
    next();
}
// Stores returnTo url for logging in and returning to a specific url to be visited
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
