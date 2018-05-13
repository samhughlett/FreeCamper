const   express = require("express"),
        router  = express(),
        Comment = require("../models/comment"),
        Campground      = require("../models/camps");

router.get("/campground/:id/comments/new", loggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            res.render("error")
        } else{
          res.render("comments/new", {campground: campground});  
        }
    });
});
router.post("/campground/:id/comments", loggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            res.render("error");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    res.render("error");
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campground/"+ campground._id);
                }
            });
        }
    });
});

//middlewares
function loggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login")
}

module.exports = router;