require('dotenv').load();

const middle = require('../middleware'),
    express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    flash = require("connect-flash"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto");

//======================top of mail box=====================


//======================bottom on mail box==================

//=====================Autherazation Routes==========================

router.get("/signup", function(req, res) {
    res.render("users/signup");
});

router.post("/signup", function(req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
           return res.render("users/signup", {error: err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash('error', user.username +', Welcome to CheapCamp, enjoy your stay.')
            return res.redirect("/campground");
        });
    });

});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campground",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome back'
    }), function(req, res){
        
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success', 'Seen you soon!');
    res.redirect("/campground");
});

router.get('/sendmail', (req, res) => {
    res.redirect("/campground");
});
module.exports = router;
