const passport = require('passport')
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const ExpressError = require('../utilities/ExpressError')
const wrapAsync = require('../utilities/wrapAsync')


module.exports.renderUserForm = (req, res) => {
    res.render('users/register'); //Render Register Page
}

module.exports.createUser = async (req, res) => {

    try {


        const { email, username, password } = req.body; //Take email, username, password from body
        const user = new User({ email, username }); //Create User Object with Username and Passowrd
        const registeredUser = await User.register(user, password); //Use Passport register to pass in and HASH password with salts, etc
        req.login(registeredUser, err => { //Log user in with passport
            if(err) return next(err); //General Error Handler
            req.flash('success', 'Welcome to spotGROUNDS'); 
            res.redirect('/spotgrounds');
        })
        console.log(registeredUser);
    }

    catch (err) {
        req.flash('error', err.message); //If Passport throws an error, flash its error message
        res.redirect('/register')
    }



}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/spotgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
}
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out.');
        res.redirect('/spotgrounds');
    });
}


