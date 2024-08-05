const express = require("express");

const router = express.Router();

const passport = require("passport");

const usersController = require("../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersController.profile
);
router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersController.update
);

router.get("/sign-up", usersController.signUp);

router.get("/sign-in", usersController.signIn);

router.post("/create", usersController.create);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/oauth2callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

// github authentication
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  usersController.createSession
);
// use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get("/sign-out", usersController.destroySession);

//reset passowr
router.post('/resetPassword', usersController.passwordReset);
router.get('/reset-password/:token', usersController.passwordResetLink);

router.post('/update-password/:token', usersController.updatePassword);

//forgot password 
router.post('/forgotPassword', usersController.forgetPassword);

router.get('/forgotPasswordRender', usersController.forgetPasswordRender);
module.exports = router;
