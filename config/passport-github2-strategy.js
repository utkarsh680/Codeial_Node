const passport = require("passport");
const githubStrategy = require("passport-github2").Strategy;
const crypto = require("crypto");
const User = require("../models/user");

//tell passport to use a new strategy for google login

passport.use(
  new githubStrategy(
    {
      clientID: "946a9763a6b0c69d738a",
      clientSecret: "0f1530b7b2edf78837b708765f573ca9ca3da5d3",
      callbackURL:
        "http://localhost:8000/users/auth/github/callback",
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString("hex"),
        });
        return done(null, newUser);
      }
      return done(null, user);
    }
  )
);
module.exports = passport;