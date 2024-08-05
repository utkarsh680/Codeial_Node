const Post = require("../models/post");
const User = require("../models/user");
// module.exports.home = async function (req, res) {
//   try {
//     const post = await Post.find({});
//     return res.render("home", {
//       title: "Codeial | Home",
//       posts: post,
//     });
//   } catch (error) {
//     console.log("error in sending post data", error);
//   }
// };

module.exports.redirectToHome = function (request, response) {
  return response.redirect("/home");
};
//populate the user of each post
module.exports.home = async function (req, res) {
  try {
    const post = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .exec();
    const users = await User.find({});
    return res.render("home", {
      title: "Codeial | Home",
      posts: post,
      all_users: users,
    });
  } catch (error) {
    console.log("error in sending post data", error);
  }
};
