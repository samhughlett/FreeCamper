var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campgound   = require("./models/camps"),
    seedDB      = require("./seed");
    
    seedDB()
//##############################################################################

    app.set("view engine", "ejs");
    mongoose.connect("mongodb://localhost/freecamp");

//##############################################################################

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res){
   res.render("landing");
   
});
app.get("/campground/new", function(req, res){
   res.render("new.ejs");
   
});
app.get("/campground", function(req, res){
    Campgound.find({}, function(err, allCampgrounds){
        if(err){
            res.render("error")
        }else{
              res.render("index", {campgrounds: allCampgrounds});
  
        }
    });
});

app.get("/login", function(req, res){
  res.render("login");
 
});
 

app.post("/campground", function(req, res){
  var name = req.body.campname,
      image = req.body.image,
      discrip =req.body.discrip,
      long = req.body.long,
      lat = req.body.lat,
      restroom =req.body.restroom,
      fire = req.body.fire,
      water = req.body.water,
      newitem = {name: name, image: image, discrip: discrip, long: long, lat: lat, restroom: restroom, water: water, fire: fire};
  Campgound.create(newitem, function(err, newlyCreated){
      if(err){
          res.render("error");
      }else{
          res.redirect("/campground");
          console.log(req.body);
      }
  });
});
app.get("/campground/:id", function(req, res){
  Campgound.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
     if(err){
         res.render("index")
     }else{
          res.render("show", {campground: foundCamp});
          
     }
  });
});


//##############################################################################
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server is now up and runing share your content"); 
});