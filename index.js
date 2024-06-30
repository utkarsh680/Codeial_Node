const express = require("express");
const app = express();

const port = 8000;

const expresLayouts = require("express-ejs-layouts");

// for layout
app.use(express.static('./assets'))
const db = require("./config/mongoose");

app.use(expresLayouts);

//extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// user express router
app.use("/", require("./routes"));

//set up the view engine

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, (err) => {
  if (err) {
    console.log(`error ${err}`);
  } else {
    console.log(`server runnig successfully on port, ${port}`);
  }
});
