const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

//sign in and create session for user
module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.jjson(422, {
        message: "Invalid Username or password",
      });
    }
    return res.json(200, {
      message: "Sign in successful, here is your token , please keep it safe!",
      data: {
        token: jwt.sign(user.toJSON(), "codeial", {expiresIn : '10000'}),
      },
    });
  } catch (error) {
    console.log("*****", error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
