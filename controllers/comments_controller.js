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
      //   await comment.populate("user", "name");
      post.comments.push(comment);
      post.save();
    }
    return res.redirect("back");
  } catch (err) {
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
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
