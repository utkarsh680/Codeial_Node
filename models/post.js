const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //include the array of ids of all coments in this post schema itself
    comments: [{
      type : mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  {
    timestamps: true,
  }
);

const post = mongoose.model("Post", postSchema);
module.exports = post;
