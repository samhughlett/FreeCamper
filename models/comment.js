    var mongoose = require("mongoose");

    var commentSchema = new mongoose.Schema({
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String,
            isAdmin: { type: Boolean, default: false },
            isOwner: { type: Boolean, default: false },
            isCamper: { type: Boolean, default: false }
        }

    });

    module.exports = mongoose.model("Comment", commentSchema);
    