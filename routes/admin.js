//==========================================
//      Coded by Sam Hughlett
//      Thanks to:
//      My wife
//      Colt Steele
//      Ian Schoonover
//      All my suppporters
//==========================================
const express = require('express'),
  router = express.Router(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("../models/user");

const middle = require('../middleware');

router.get('/', middle.loggedIn, middle.isAdmin, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.render('error');
    }
    else {
      req.flash("success", "Welcome");
      res.render('admin/console', { users: users });
    }
  });
});
router.get('/console/user/:id', middle.loggedIn, middle.isAdmin, (req, res) => {
  User.findById(req.params.id, (err, foundUsers) => {
    if (err) {
      res.redirect("error");
    }
    else {
      res.render("admin/user", { users: foundUsers });
    }
  });
});

router.put('/console/user/:id', (req, res)=>{
    User.findByIdAndUpdate(req.params.id, req.body, (err, updatedUsers) => {
    if (err) {
      res.redirect("error");
    }
    else {
      res.render("admin/user", { users: updatedUsers });
    }
  });
});

router.delete('/console/user/:id/delete', middle.loggedIn, middle.isAdmin, (req, res) => {
  User.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.render("error");
    }
    else {
      req.flash('error', 'You have succesfully deleted a user.');
      res.redirect('/campground/admin');
    }
  });
});

module.exports = router;
