const express = require("express");
const cookieParser = require("cookie-parser");
const expresLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

const app = express();
const port = 8000;

const db = require("./config/mongoose");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require('./config/passport-jwt-strategy')

// Middleware for SASS
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "expanded",
    prefix: "/css",
  })
);

// Serve static files and uploads
app.use(express.static("./assets"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// Parse URL-encoded bodies and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up express-ejs-layouts
app.use(expresLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Set up session management with MongoStore
app.use(
  session({
    name: "codeial",
    secret: "hellohowareyou", // TODO: Change the secret before deployment
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

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Set authenticated user
app.use(passport.setAuthenticatedUser);

// Flash messages middleware
app.use(flash());
app.use(customMware.setFlash);

// Use express router
app.use("/", require("./routes"));

// Start server
app.listen(port, (err) => {
  if (err) {
    console.log(`Error: ${err}`);
  } else {
    console.log(`Server running successfully on port ${port}`);
  }
});