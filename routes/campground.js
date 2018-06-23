const   express         = require('express'),
        router          = express.Router(),
        Campground      = require('../models/camps');
        
const middle = require('../middleware');       
router.get('/new', middle.loggedIn, function(req, res){
   res.render('campgrounds/new.ejs');
   
});
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            res.render('error');
        }else{
              res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user });
  
        }
    });
});


//==============================================================================
//                      CAMPGROUND INFO
//============================================================================== 

router.post('/', middle.loggedIn, function(req, res){
  var 
    name      = req.body.campname,
    image     = req.body.image,
    discrip   = req.body.discrip,
    long      = req.body.long,
    lat       = req.body.lat,
    restroom  = req.body.restroom,
    fire      = req.body.fire,
    water     = req.body.water,
    state     = req.body.state,
    rvParking = req.body.rvParking,
    cell      = req.body.cell,
    ppn       = req.body.ppn,
    author    = {
        id:  req.user._id,
        username: req.user.username
      },
      newitem = {author: author, name: name, image: image, discrip: discrip, long: long, lat: lat, restroom: restroom, water: water, fire: fire, state: state, rvParking: rvParking, cell: cell, ppn: ppn};
  Campground.create(newitem, function(err, newlyCreated){
      if(err){
          res.render('error');
      }else{
          res.redirect('/campground');
          console.log(req.body);
      }
  });
});
router.get('/:id', function(req, res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCamp){
     if(err){
         res.render('campgrounds/index');
     }else{
          res.render('campgrounds/show', {campground: foundCamp});
          
     }
  });
});
//==============================================================================
//               GET AND PUT ROUTES FOR EDITING  AND DELETEING
//==============================================================================
router.get('/:id/edit', middle.campOwner, function(req, res){
            Campground.findById(req.params.id, function(err, foundCamp){
              if (err){
                res.render('error');
              } else{
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