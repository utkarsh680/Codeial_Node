const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/codeial-development");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "error conneting to MongoDB"));

db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});

module.exports = db;
