require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Database connection
require("./configs/db.config");

// Passport configuration
require("./configs/passport.config");

// App configs
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Initiate app with express
const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESS_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Sass Middleware
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

/*app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));*/
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

// Routes Middleware
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth.routes"));

// Setting up environments
/*if (process.env.NODE_ENV === "production") {
  // set ability to get static values from client build folder
  // static files include all javascript and css files
 // app.use(express.static("client/build"));

  // get the index.html that will be rendered on the browser
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "../client", "build", "index.html"));
  });
}*/

module.exports = app;