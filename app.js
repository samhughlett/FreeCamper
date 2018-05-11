var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    seedDB          = require("./seed"),
    Comment         = require("./models/comment"),
    Campground      = require("./models/camps"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");
    
//   seedDB()
//##############################################################################

    app.set("view engine", "ejs");
    mongoose.connect("mongodb://localhost/freecamp");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(__dirname + "/public"));
    app.use(require("express-session")({
        secret: "freecampingiscool",
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
//##############################################################################
app.get("/", function(req, res){
   res.render("landing");
   
});
app.get("/campground/new", function(req, res){
   res.render("campgrounds/new.ejs");
   
});
app.get("/campground", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            res.render("error");
        }else{
              res.render("campgrounds/index", {campgrounds: allCampgrounds});
  
        }
    });
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
app.get("/campground/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
     if(err){
         res.render("campgrounds/index")
     }else{
          res.render("campgrounds/show", {campground: foundCamp});
          
     }
  });
});

app.get("/campground/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            res.render("error")
        } else{
          res.render("comments/new", {campground: campground});  
        }
    });
});
app.post("/campground/:id/comments", function(req, res){
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
//=====================Autherazation Routes==========================

app.get("/signup", function(req, res){
  res.render("users/signup");
});

app.post("/signup", function(req, res){
    req.body.username;
    req.body.password;
    var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("error");
            }
        passport.authenticate("local")(req, res, function(){
           return res.redirect("/campground");
            });
        });
    });

app.get("/login", function(req, res){
  res.render("users/login");
});

app.post("/login",  passport.authenticate("local", 
    { 
    successRedirect: '/campground', 
    failureRedirect: '/login' }), 
    function(req, res){
});

//##############################################################################
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server is now up and runing share your content"); 
});