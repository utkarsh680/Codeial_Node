const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { resetPasswordMail } = require("../mailers/resetPassword_mailer");
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

// for password reset
module.exports.passwordReset = (req, res, next) => {
  try {
    const email = req.body.email;
    // Generate JWT token
    const resetToken = generateResetToken(email);
    const resetLink = `http://localhost:8000/users/reset-password/${resetToken}`;
    // Send the resetToken to the user (e.g., via email)
    resetPasswordMail(
      email,
      "Password Reset",
      `Use the following link to reset your password: ${resetLink}`
    );
    req.flash("success", "Password reset link sent to you Email");
  } catch (error) {
    console.log(err);
  }
  return res.redirect("back");
};

// Function to generate JWT token
const generateResetToken = (userEmail) => {
  const payload = { userEmail };
  const options = { expiresIn: "1h" }; // Set an expiration time for the token
  return jwt.sign(payload, secretKey, options);
};

// password reset link
exports.passwordResetLink = (req, res) => {
  const resetToken = req.params.token;
  // Decode the token for demonstration purposes
  const decodedToken = decodeResetToken(resetToken);
  // console.log('decode', decodedToken)

  return res.render("reset_password", {
    title: "Password Reset",
    token: resetToken,
    email: decodedToken.userEmail,
  });
};

// Generate a random secret key
const secretKey = "hellosirhowareyou";

// Function to decode JWT token
const decodeResetToken = (token) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // 'decoded' will contain the payload information
    return decoded;
  } catch (err) {
    // If the token is invalid or has expired, an error will be thrown
    console.error(err);
    return null;
  }
};
exports.updatePassword = async (req, res) => {
  const resetToken = req.params.token;

  // Decode the token for demonstration purposes
  const decodedToken = decodeResetToken(resetToken);

  if (!decodedToken) {
    req.flash("error", "invalid link!");
    return res.redirect("back");
  }
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Please Match the Password!");
    return res.redirect("back");
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: decodedToken.userEmail },
      { password: req.body.password },
      { new: true }
    );

    if (!updatedUser) {
      req.flash("error", "Error updating password. User not found.");
      return res.redirect("back");
    }
    // Check if the resetToken property exists before attempting to update it
    if (updatedUser.resetToken) {
      // Expire the reset token immediately
      updatedUser.resetToken.expires = new Date();
      await updatedUser.save();
      req.flash("success", "Password reset successfully");
    }

    return res.redirect("/users/sign-in");
  } catch (error) {
    req.flash("error", "Error updating password. Please try again.");
    return res.redirect("back");
  }
};

exports.forgetPasswordRender = (req, res) => {
  const user = User.findOne({ email: req.body.email });
  return res.render("forget_password", {
    title: "Forgot password",
    user,
  });
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Email not found!");
      return res.redirect("back");
    }
    // Generate JWT token
    const resetToken = generateResetToken(email);

    const resetLink = `http://localhost:8000/users/reset-password/${resetToken}`;

    // Send the resetToken to the user (e.g., via email)

    resetPasswordMail(
      email,
      "Password Reset",
      `Use the following link to reset your password: ${resetLink}`
    );
    req.flash('success', "Reset Link sent to your Email")
    return res.redirect("back");
  } catch (error) {
    req.flash("error", " Please try again.");
    console.log(error);
    return res.redirect("back");
  }
};
