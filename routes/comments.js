const   express = require("express"),
        router  = express.Router({mergeParams: true}),
        Comment = require("../models/comment"),
        Campground      = require("../models/camps");
const middle = require('../middleware');
router.get("/new", middle.loggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            res.render("error")
        } else{
          res.render("comments/new", {campground: campground});  
        }
    });
});
router.post("/", middle.loggedIn, function(req, res){
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
//==============================================================================
//               GET AND PUT ROUTES FOR EDITING  AND DELETEING----- curently working on this
//==============================================================================
router.get('/:id/edit', function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err){
            res.redirect('/error');
        } else {
            res.render('campgrounds/edit', {campground: foundCamp});
        }
    });
});

router.put('/:id/edit', function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err){
            res.render('error');
        } else {
            res.redirect('/campground/'+ req.params.id);
        }
    });
});

router.delete('/:id', function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.render('error');
        } else{
            res.redirect('/campground');
        }
    });
});
module.exports = router;