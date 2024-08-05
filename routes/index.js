const express = require("express");

const router = express.Router();
const passport = require("passport");

const homeController = require("../controllers/home_controller");

router.get("/", homeController.redirectToHome);
router.get("/home", passport.checkAuthentication, homeController.home);

router.use("/users", require("./users"));

router.use("/posts", require("./posts"));

router.use("/comments", require("./comments"));

router.use("/api", require("./api"));

module.exports = router;
