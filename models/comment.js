    var mongoose = require("mongoose");
    let user = ('/users');

    var commentSchema = new mongoose.Schema({
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String,
        isAdmin: { type: Boolean},
        isOwner: { type: Boolean},
        isCamper: { type: Boolean},
        },
        time: String

    });

    module.exports = mongoose.model("Comment", commentSchema);
    