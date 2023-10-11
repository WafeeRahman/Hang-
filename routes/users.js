const passport = require('passport')
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users') // Controller for rendering / posting user routes
const { storeReturnTo } = require('../middleware');
const ExpressError = require('../utilities/ExpressError')
const wrapAsync = require('../utilities/wrapAsync')

// Import express router for user-related routes, and User Data Model

router.route('/register')

    .get(users.renderUserForm)

    .post(wrapAsync(users.createUser));

//Authenticate with passport using the local strategy, flash a message and redirect to login on failure
router.route('/login')
    .get(users.renderLoginForm)

    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.loginUser);



router.get('/logout', users.logoutUser);

module.exports = router;

