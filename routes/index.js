const   express = require("express"),
        router  = express(),
        passport= require("passport"),
        User    = require("../models/user");
//=====================Autherazation Routes==========================

router.get("/signup", function(req, res){
  res.render("users/signup");
});

router.post("/signup", function(req, res){
    req.body.username;
    req.body.password;
    var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
                    console.log(req.body.username);
            console.log(req.body.password);
        if(err){
            console.log(err)
            return res.render("error");
            }
        passport.authenticate("local")(req, res, function(){
           return res.redirect("/campground");
            });
            console.log("username is: "+req.body.username);
            console.log("password is: "+req.body.password);
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
function loggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login")
}

module.exports = router;