const User = require("../models/user");
module.exports.profile = async function (req, res) {
  try {
    if (req.cookies.user_id) {
      const user = await User.findById(req.cookies.user_id);

      if (!user) {
        console.log("return to singh");
        return res.redirect("/users/sign-in");
      }
      return res.render("user_profile", {
        title: "user profile",
        user: user,
      });
    }
  } catch (error) {
    console.log(error);
  }
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
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.redirect("back");
    }

    if (user.password !== req.body.password) {
      console.log(user.password, req.body.password);
      return res.redirect("back");
    }

    // handle session creation
    res.cookie("user_id", user.id);
    return res.redirect("/users/profile");
  } catch (err) {
    console.log("Error in finding user during sign-in: ", err);
    return res.redirect("back");
  }
};

module.exports.destroySession = function (req, res) {
  try {
    res.clearCookie("user_id"); // Clear the session cookie
    return res.redirect("/"); // Redirect to the homepage or login page
  } catch (err) {
    console.log("Error in destroying session: ", err);
    return res.redirect("back");
  }
};
