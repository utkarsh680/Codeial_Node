const User = require("../models/user");
module.exports.profile = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    return res.render("user_profile", {
      title: "users profile",
      profile_user: user,
    });
  } catch (error) {
    console.log("error is showing profile", error);
  }
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "user sign up",
  });
};
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
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

//sign in and create session for user
module.exports.createSession = async function (req, res) {
  req.flash("success", "logged in Successfully");
  return res.redirect("/");
};

//for destroy the function
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return console.log(err);
    }
    req.flash("success", "you have logged out!");
    return res.redirect("/users/sign-in");
  });
};

//for updating the user profile

module.exports.update = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);

    User.uploadedAvatar(req, res, function (err) {
      if (err) {
        console.log("****Multer Error", err);
      }

      user.name = req.body.name;
      user.email = req.body.email;

      if (req.file) {
        //this is saveing the path of the uploaded file into the avatar field in the user
        user.avatar = User.avatarPath + "/" + req.file.filename;
      }
      user.save();
      return res.redirect("back");
    });

    // if (req.user.id === req.params.id) {
    //   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //   });
    //   if (!user) {
    //     req.flash("error", "User not found!");
    //     return res.status(404).send("User not found");
    //   }
    //   req.flash("success", "Profile updated succesfully!");

    //   res.redirect("back");
    // } else {
    //   res.status(401).send("Unauthorized");
    // }
  } catch (error) {
    req.flash("error", "Error in updating profil!");

    console.log("Error in updating profile:", error);
    res.status(500).send("Internal Server Error");
  }
};
