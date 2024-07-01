const User = require("../models/user");
module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "users profile",
  });
};

module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "user sign up",
  });
};
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "user sign in",
  });
};

// get the sign up data
module.exports.create = async function (req, res) {
  console.log(req.body.email, req.body.password, req.body.confirm_password);

  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  const user = await User.findOne({ email: req.body.email });
  try {
    console.log(user);
    if (!user) {
      const userCreate = User.create(req.body);
      console.log(userCreate);
      console.log(req.body);
      if (userCreate) {
        console.log("hello");
        return res.redirect("/users/sign-in");
      }
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error", err);
  }
};

//get sign in data
