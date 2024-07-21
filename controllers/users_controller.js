const User = require("../models/user");
const fs = require("fs");
const path = require("path");

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
    if (req.user.id === req.params.id) {
      const user = await User.findById(req.params.id);

      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("**MulterError", err);
        }
        user.name = req.body.name;
        user.address = req.body.address;

        if (req.file) {
          // Check if the request contains a file (req.file is truthy)
          if (user.avatar) {
            // Check if the user already has an avatar path stored
            const avatarPath = path.join(__dirname, "..", user.avatar);

            // Check if the avatar file actually exists before attempting to delete
            if (fs.existsSync(avatarPath)) {
              fs.unlinkSync(avatarPath);
            }
          }

          // Save the path of the uploaded file into the avatar field in the user object
          user.avatar = User.avatarPath + "/" + req.file.filename;
        } else {
          // Handle the case where no file is present in the request
          console.error("No file uploaded.");
        }

        user.save();
        // return res.status(200).json({
        //   data : {
        //     user:user
        //   },
        //   message: "Profile updated!"
        // });
        return res.redirect("back");
      });
    } else {
      // User is unauthorized
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
};
