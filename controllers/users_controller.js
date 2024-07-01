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
      if (userCreate) {
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

module.exports.createSession = async function (req, res) {
  try {
    console.log(req.body.email);
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      console.log("User not found");
      return res.redirect("back");
    }

    if (user.password !== req.body.password) {
      console.log("Incorrect password");
      console.log(user.password, req.body.password);
      return res.redirect("back");
    }

    // handle session creation
    res.cookie("user_id", user.id);
    console.log("User authenticated, redirecting to profile page");
    return res.redirect("/users/profile");
  } catch (err) {
    console.log("Error in finding user during sign-in: ", err);
    return res.redirect("back");
  }
};
