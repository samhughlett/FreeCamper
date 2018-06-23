const middle = require('../middleware');
const   express = require("express"),
        router  = express.Router(),
        passport= require("passport"),
        User    = require("../models/user");
//=====================Autherazation Routes==========================

router.get("/signup", function(req, res){
  res.render("users/signup");
});

router.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("error");
            }
        passport.authenticate("local")(req, res, function(){
           return res.redirect("/campground");
            });
            console.log("username is: "+req.body.username);
            console.log("email is: "+req.body.email);
        });
    });

router.get("/login", function(req, res){
  res.render("users/login");
});

router.post("/login", passport.authenticate("local", 
    { 
        successRedirect: '/campground', 
        failureRedirect: '/login' 
    }), function(req, res){});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campground");
});

//middlewares

module.exports = router;