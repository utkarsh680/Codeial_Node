const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.findById(req.body.post);

    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      await comment.populate("user", "name");
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created!",
        });
      }
      post.comments.push(comment);
      post.save();
      req.flash("success", "Comment Deleted successfully!");
    }
    return res.redirect("back");
  } catch (err) {
    req.flash("error", "Error in creating a comment!");
    console.error("Error in creating a comment", err);
  }
};
module.exports.destroy = async function (req, res) {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId).exec();
    console.log(comment);
    //  .id means converting object id into strings
    if (comment.user == req.user.id) {
      let postId = comment.post;

      await comment.deleteOne();
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: commentId },
      });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted!",
        });
      }
      req.flash("success", "comment Deleted successfully!");
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    req.flash("error", "Error in deleting comment!");
    return res.status(500).send("Internal Server Error");
  }
};
