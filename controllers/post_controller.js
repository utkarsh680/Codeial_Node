const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post created",
      });
    }
    req.flash("success", "Post published!");
    return res.redirect("back");
  } catch (err) {
    console.log("error in creating a post", err);
    req.flash("error", "error in creating a post");

    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).exec();
    //  .id means converting object id into strings
    if (post.user == req.user.id) {
      await post.deleteOne();
      await Comment.deleteMany({ post: postId }).exec();
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted successfully",
        });
      }
      req.flash("success", "Post Deleted successfully!");

      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    req.flash("error", "Error in deleting post!");
    return res.status(500).send("Internal Server Error");
  }
};
