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
        async.waterfall([
            function(user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'freecampreset@gmail.com',
                        pass: process.env.GMAILPW
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'freecampreset@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('success', 'Success! Your password has been changed.');
                });
            },
        ]);
        if (err) {
            console.log(err);
            return res.render("error");
        }
        passport.authenticate("local")(req, res, function() {
            return res.redirect("/campground");
        });
    });

});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: '/campground',
    failureRedirect: '/login'
}), function(req, res) {});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campground");
});

router.get('/sendmail', (req, res) => {
    res.redirect("/campground");
});
module.exports = router;
