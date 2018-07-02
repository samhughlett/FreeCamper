var Comment = require('../models/comment');
var Campground = require('../models/camps');

const
    express         = require('express'),
    app             = express(),
    router          = express.Router(),
    client          = require('redis').createClient();
//================================================================
//
//================================================================
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
        },
        logginLimiter: function (req, res, next){

        },
//====================================================================\
//      Add new middleware functions below here then move this breaker.|
//====================================================================/
};





var mailgun = require("mailgun-js");
var api_key = 'YOUR_API_KEY';
var DOMAIN = 'YOUR_DOMAIN_NAME';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});