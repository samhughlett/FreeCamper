var mongoose = require("mongoose");
let Comment = require("./comment");

var campgroundSchema = new mongoose.Schema({
    name: String,
    lat: String,
    long: String,
    image: String,
    imageId: String,
    discrip: String,
    fire: String,
    water: String,
    restroom: String,
    state: String,
    cell: String,
    rvParking: String,
    ppn: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

campgroundSchema.pre('remove', async function(next){
    try {
         await Comment.remove({
      "_id": {
        $in: this.comment
      }
      });  
      next()
    }catch(err){
        next(err);
    }

});
module.exports = mongoose.model("Campground", campgroundSchema);
