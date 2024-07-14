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

const MongoStore = require("connect-mongo");

const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "expanded",
    prefix: "/css",
  })
);

app.use(express.urlencoded());
app.use(cookieParser());

app.use(expresLayouts);

//extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up the view engine

app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is use to use the session cookie in the db
app.use(
  session({
    name: "codeial",
    //todo change the secret before deployment in production mode
    secret: "hellohowareyou",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://127.0.0.1/codeial-development",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
// user express router
app.use("/", require("./routes"));
app.listen(port, (err) => {
  if (err) {
    console.log(`error ${err}`);
  } else {
    console.log(`server runnig successfully on port, ${port}`);
  }
});
