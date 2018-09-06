var Comment = require('../models/comment');
var Campground = require('../models/camps');

const
  express = require('express'),
  app = express(),
  router = express.Router(),
  flash = require("connect-flash");
//================================================================
//
//================================================================
module.exports = {
  loggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'You must be signed in to do that.');
    res.redirect("/login");
  },

  isAdmin: function(req, res, next) {
    if (!req.user) {
      req.flash('error', 'You must be logged in to do that.');
      res.redirect('/login');
    }
    else if (req.user.isAdmin) {
      next();
    }
    else {
      req.flash('error', 'You must be an admin to go there.');
      res.redirect('/back');
    }
  },
  campOwner: function(req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCamp) {
               if(err || !foundCamp){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campgrounds');
        }
        else {
           if (foundCamp.author.id.equals(req.user._id)) {
            next();
          }
          else {
             req.flash('error', "That\'s not yours don\'t play with it.");
            return res.redirect('back');
          }
        }
      })
    }
  },
  commentOwner: function(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.id, function(err, foundComment) {
        if (err || !foundComment) {
          res.flash('error', 'Camp not found please contact Web Admin.');
          return res.redirect('back');
        }
        else {
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          }
          else {
             req.flash('error', "Is that your comment? Didn\'t think so.");
            return res.redirect('back');
          }
        }
      })
    }
  },
  logginLimiter: function(req, res, next) {

  },
  
  //====================================================================\
  //      Add new middleware functions below here then move this breaker.|
  //====================================================================/
};
