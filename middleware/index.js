var Comment = require('../models/comment');
var Campground = require('../models/camps');
module.exports = {
        loggedIn: function(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
        },
        
        isAdmin: function(req, res, next){
          if (!req.user){
            res.redirect('/campground');
        }else if (req.user.isAdmin){
            next();
        }else{
          res.redirect('/campground');
        }

        },        
        campOwner: function(req, res, next){
        if (req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCamp){
             if (err){
            return res.redirect('back');
             } else {
            if (foundCamp.author.id.equals(req.user._id)){
                next();
            }else{
                return res.redirect('back');
            }
             }
            }
        )}
        },   
        commentOwner: function(req, res, next){
        if (req.isAuthenticated()){
            Comment.findById(req.params.id, function(err, foundComment){
             if (err){
            return res.redirect('back');
             } else {
            if (foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                return res.redirect('back');
            }
             }
            }
        )}
        }
};