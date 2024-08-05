const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// tell passport to use a new strategy for google login

passport.use(
  new googleStrategy(
    {
      clientID:
        "865151280041-035iltpe0e2ck7gbg2h659etv415r5qs.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/oauth2callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      //find the user
      const user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        //if found, set this user as req.user
        return done(null, user);
      } else {
        //if not found, create the user and set at as req.user
        const user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
        });
        return done(null, user);
      }
    }
  )
);

module.exports = passport;
