const   mongoose    = require("mongoose"),
        passportLocalMongoose = require("passport-local-mongoose"),
        UserSchema = new mongoose.Schema({
            email: String,
            username: String,
            password: String,
            isAdmin: {type: Boolean, default: false},
            isOwner: {type: Boolean, default:false},
            comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
        });
        
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);