require('dotenv').config();
const ejsLint = require('ejs-lint');
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    seedDB          = require('./seed'),
    flash           = require('connect-flash'),
    router          = express.Router(),
    method          = require('method-override'),
    Comment         = require('./models/comment'),
    Campground      = require('./models/camps'),
    User            = require('./models/user'),
    passport        = require('passport'),
    nodemailer      =require("nodemailer"),
    LocalStrategy   = require('passport-local');
    
//  seedDB()
//##############################################################################
    app.use(flash());
    app.set('view engine', 'ejs');
    const database = process.env.DATABASECONNECT || 'mongodb://localhost/freecamp'
    mongoose.connect(database)
        .then(()=> console.log("database conected"))
        .catch(err => console.log('database connection error: ${err.message}'));
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(__dirname + '/public'));
    app.use(require('express-session')({
        secret: process.env.SESSION,
        resave: false,
        saveUninitialized: false
    }));
    
    app.use(method('_method'));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(function (req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error  = req.flash('error');
        res.locals.success  = req.flash('success');
        next();
    });
//=============================================================================
//                               Routes
const   
        adminRoutes         = require('./routes/admin'),
        commentsRoutes      = require('./routes/comments'),
        campgroundRoutes    = require('./routes/campground'),
        resetRoutes         = require('./routes/reset'),
        indexRoutes         = require('./routes/index');
//##############################################################################
app.get('/', function(req, res){
   res.render('index');
   
});
app.use('/campground/admin', adminRoutes);
app.use('/', indexRoutes);
app.use('/help', resetRoutes);
app.use('/campground', campgroundRoutes);
app.use('/campground/:id/comments', commentsRoutes);
//##############################################################################
app.listen(process.env.PORT, process.env.IP, function(){
   console.log('The server is now up and runing share your content'); 
});