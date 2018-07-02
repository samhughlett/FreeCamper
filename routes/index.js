require('dotenv').config();

const   middle      = require('../middleware');
const   express     = require("express"),
        router      = express.Router(),
        client      = require('redis').createClient(),
        passport    = require("passport"),
        User        = require("../models/user");
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
        });
    });

router.get("/login", (req, res)=>{
  res.render("users/login");
});

router.post("/login", passport.authenticate("local", 
    { 
        successRedirect: '/campground', 
        failureRedirect: '/login' 
    }), function(req, res){});

router.get("/logout", (req, res)=> {
    req.logout();
    res.redirect("/campground");
});

module.exports = router;