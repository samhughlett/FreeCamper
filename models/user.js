const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    UserSchema = new mongoose.Schema({
        email: { type: String, unique: true, required: true },
        username: { type: String, unique: true, required: true },
        password: String,
        isAdmin: { type: Boolean, default: false },
        isOwner: { type: Boolean, default: false },
        isCamper: { type: Boolean, default: false },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]
    });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
