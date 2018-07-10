var mongoose = require("mongoose")
var campgroundSchema = new mongoose.Schema({
    name: String,
    lat: String,
    long: String,
    image: String,
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

module.exports = mongoose.model("Campground", campgroundSchema);
