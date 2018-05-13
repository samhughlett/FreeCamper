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
        secret: "",
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(function (req, res, next){
        res.locals.currentUser = req.user;
        next();
    });
//=============================================================================
//                               Routes
const   commentsRoutes      = require("./routes/comments"),
        campgroundRoutes    = require("./routes/campground"),
        indexRoutes      = require("./routes/index");
//##############################################################################
app.get("/", function(req, res){
   res.render("landing");
   
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);

//##############################################################################
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server is now up and runing share your content"); 
});