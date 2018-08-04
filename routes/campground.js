require('dotenv').load();
const express = require('express'),
  router = express.Router(),
  Campground = require('../models/camps'),
  Comments = require('../models/comment');
let multer = require('multer');
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = (req, file, cb)=> {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})

let cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const middle = require('../middleware');
const {loggedIn, campOwner, commentOwner, isAdmin} = middle;
router.get('/new', middle.loggedIn, function(req, res) {
  res.render('campgrounds/new.ejs');

});
router.get('/', (req, res)=> {
  Campground.find({}, (err, allCampgrounds)=> {
    if (err) {
      res.render('error');
    }
    else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds, currentUser: req.user });

    }
  });
});


//===========================================================================
//                           CAMPGROUND INFO
//===========================================================================

router.post('/', loggedIn, upload.single('image'), (req, res)=> {
  cloudinary.uploader.upload(req.file.path, function(result) {
  req.body.campground.image = result.secure_url;
  req.body.campground.imageId = result.public_id
  //Adds associates user to comment.
        req.body.campground.author = {
        id: req.user._id,
        username: req.user.username,
}
  Campground.create(req.body.campground, (err, newlyCreated)=> {
    if (err) {
            req.flash('error', err.message);
      return res.redirect('back');
    }
    else {
      res.redirect('/campground');
      console.log(req.body.capground);
    }
  });
 });
});
router.get('/:id', (req, res)=> {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCamp)=> {
    if (err) {
      res.render('campgrounds/index');
    }
    else {
      res.render('campgrounds/show', { campground: foundCamp });

    }
  });
});
//==============================================================================
//               GET AND PUT ROUTES FOR EDITING AND DELETEING
//==============================================================================
router.get('/:id/edit', campOwner, (req, res)=> {

  Campground.findById(req.params.id, (err, foundCamp)=>{
    if (err) {
      res.render('error');
    }
    else {
      res.render('campgrounds/edit', { campground: foundCamp });
    }
  });
});

router.put('/:id/edit', upload.single('image'), (req, res)=> {
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, async function(err, updatedCamp){
        if(err){
          req.flash("error", err.message);
          res.redirect("back");
        } else {
        if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(updatedCamp.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  updatedCamp.imageId = result.public_id;
                  updatedCamp.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            updatedCamp.name = req.body.name;
            updatedCamp.description = req.body.description;
            updatedCamp.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/campground/" + updatedCamp._id);
        }
    });
});


router.delete('/:id', function(req, res, next) {
  Campground.findById(req.params.id, function(err, campground,) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }else{
        cloudinary.v2.uploader.destroy(campground.imageId, function(err){
          if (err){
          }else{
          campground.remove();
          req.flash('success', 'Campground deleted successfully!');
          res.redirect('/campground');
          }
        });
    }
  });
});

module.exports = router;
