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
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.options('*', cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

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

app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.locals.title = "Express - Generated with IronGenerator";

app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/app.routes"));


module.exports = app;