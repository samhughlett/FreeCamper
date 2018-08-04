const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    Campground = require("../models/camps");
const middle = require('../middleware');
//==============================================================================
//                           Basic Routing table/ the GET ROUTES
//==============================================================================
router.get("/new", middle.loggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.render("error");
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });
});

//==============================================================================
//                  Basic Routing table/ the POST ROUTES
//==============================================================================
// will get shorted by isAuthor middleware
router.post("/", middle.loggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.render("error");
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    res.render("error");
                }
                else {
                    //working on adding user recongnition. through middleware
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.isAdmin = req.user.isAdmin;
                    comment.author.isOwner = req.user.isOwner;
                    comment.author.isCamper = req.user.isCamper;
                    console.log(comment);
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
});
//==============================================================================
//              GET AND PUT ROUTES FOR EDITING COMMENTS
//==============================================================================

//  Edit the user comments.
router.get("/:comment_id/edit", middle.loggedIn, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
            req.flash("error", "Something went wrong, contact Web Admin.");
            res.redirect('back');
        }
        else {
            req.flash('success', 'Thank you for your comment')
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
});
// PUSHES THE EDITED COMMENT TO THE DB
router.put('/:comment_id', middle.loggedIn, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updated) => {
        if (err) {
            req.flash("error", "Something went wrong, contact Web Admin.");
            res.redirect('back');        
        }
        else {
            res.redirect('/campground/' + req.params.id);
        }
    });
});
//==============================================================================
//                  ROUTES FOR DELETEING COMMENTS
//==============================================================================
router.delete('/:comment_id', middle.loggedIn, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong, contact Web Admin.");
            res.redirect('back');
        }
        else {
            req.flash('success', 'Your comment has been removed');
            res.redirect('/campground/' + req.params.id);
        }
    });
});
//==============================================================================
//                  CATCH ALL RAOUTE AND EXPORTS 
//==============================================================================

router.get("/*", (req, res) => {
    res.redirect('back');
});
module.exports = router;
