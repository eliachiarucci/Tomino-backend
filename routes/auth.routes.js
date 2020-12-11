const { Router } = require("express");
const router = Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const fileUploader = require("../configs/cloudinary.config");

const User = require("../models/user.model");

router.post("/signup", fileUploader.single("imageUrl"), (req, res) => {
  let { username, email, password, image } = req.body;
  username = username.toLowerCase();
  email = email.toLowerCase();
  console.log(username, email, password, image);
  if (!username || !password || !email || !image) {
    console.log("ERROR FIELDS")
    res.status(400).json({ message: "Provide all the fields" });
    return;
  }

  if (password.length < 7) {
    console.log("ERROR PASSWORD")
    res.status(400).json({
      message:
        "Please make your password at least 8 characters long for security purposes.",
    });
    return;
  }
  User.findOne({ username, email }, (err, foundUser) => {
    // In case of any server errors that may occur
    if (err) {
      console.log("ERROR DB")
      res.status(500).json({ message: "User check went bad." });
      return;
    }

    // If the username already exists
    if (foundUser) {
      console.log("ERROR ALREADY USER")
      res.status(400).json({ message: "Username or email already taken. Choose another ones." });
      return;
    }

    // Generate salt for hashing password
    const salt = bcrypt.genSaltSync(10);

    // Hash the incoming password
    const hashPass = bcrypt.hashSync(password, salt);

    // Create a new user with incoming username & hashed password
    const aNewUser = new User({
      username: username,
      password: hashPass,
      email: email,
      image: image
    });

    
    aNewUser.save((err) => {
      if (err) {
        console.log("ERROR SAVE")
        res
          .status(400)
          .json({ message: err });
        return;
      }
      res.status(200).json(aNewUser);

    });
  });
});

/* LOGIN ROUTE */
router.post("/login", (req, res, next) => {
  
  passport.authenticate("local", (err, theUser, failureDetails) => {
    console.log(err);
    if (err) {
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }
    
    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      console.log(req.session)
      if (err) {
        res.status(500).json({ message: "Session save went bad." });
        return;
      }

      res.status(200).json(theUser);
    });
  })(req, res, next);
});

/* LOGOUT ROUTE */
router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

/* LOGGEDIN */
router.get("/loggedin", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});

/* POST - upload images   */
router.post("/upload", fileUploader.single("image"), (req, res, next) => {
  res.status(200).json({ cloudinaryUrl: req.file.path });
});

module.exports = router;