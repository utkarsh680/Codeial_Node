const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
module.exports.index = async function (req, res) {
  try {
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .exec();
    return res.json(200, {
      message: "List of posts",
      posts: posts,
    });
  } catch (error) {
    console.log(error);
  }
};

// destroy method

module.exports.destroy = async function (req, res) {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).exec();
    //  .id means converting object id into strings
    // if (post.user == req.user.id) {
    await post.deleteOne();
    await Comment.deleteMany({ post: postId }).exec();

    return res.json(200, {
      message: "Post and associated comments deleted successfully",
    });

    // } else {
    //   return res.redirect("back");
    // }
  } catch (err) {
    return res.json(500, {
      message: "Internal Server error",
    });
  }
};
