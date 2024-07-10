const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    return res.redirect("back");
  } catch (err) {
    console.log("error in creating a post", err);
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
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
