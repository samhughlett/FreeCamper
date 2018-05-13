const   express = require("express"),
        router  = express.Router(),
        Campground      = require("../models/camps");
router.get("/campground/new", function(req, res){
   res.render("campgrounds/new.ejs");
   
});
router.get("/campground", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            res.render("error");
        }else{
              res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user });
  
        }
    });
});


 

router.post("/campground", function(req, res){
  var name = req.body.campname,
      image = req.body.image,
      discrip =req.body.discrip,
      long = req.body.long,
      lat = req.body.lat,
      restroom =req.body.restroom,
      fire = req.body.fire,
      water = req.body.water,
      state = req.body.state,
      newitem = {name: name, image: image, discrip: discrip, long: long, lat: lat, restroom: restroom, water: water, fire: fire};
  Campground.create(newitem, function(err, newlyCreated){
      if(err){
          res.render("error");
      }else{
          res.redirect("/campground");
          console.log(req.body);
      }
  });
});
router.get("/campground/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
     if(err){
         res.render("campgrounds/index");
     }else{
          res.render("campgrounds/show", {campground: foundCamp});
          
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