const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const port = 8000;

const expresLayouts = require("express-ejs-layouts");

// for layout
app.use(express.static("./assets"));
const db = require("./config/mongoose");

//use for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

app.use(express.urlencoded());
app.use(cookieParser());

app.use(expresLayouts);

//extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up the view engine

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "codeial",
    //todo change the secret before deployment in production mode
    secret: "hellohowareyou",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: (1000 * 60 * 100),
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)

// user express router
app.use("/", require("./routes"));
app.listen(port, (err) => {
  if (err) {
    console.log(`error ${err}`);
  } else {
    console.log(`server runnig successfully on port, ${port}`);
  }
});
