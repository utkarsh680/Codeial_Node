const Post = require("../models/post");
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

//populate the user of each post
module.exports.home = async function (req, res) {
  try {
    const post = await Post.find({}).populate("user").exec();
    return res.render("home", {
      title: "Codeial | Home",
      posts: post,
    });
  } catch (error) {
    console.log("error in sending post data", error);
  }
};
