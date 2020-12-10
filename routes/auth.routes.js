const { Router } = require("express");
const router = Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const fileUploader = require("../configs/cloudinary.config");
const tsUploader = require("../configs/cloudinaryTS.config");

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

    // Attempt to save the new user to the database
    aNewUser.save((err) => {
      // When/If any issues arise while saving the user to the database
      if (err) {
        console.log("ERROR SAVE")
        res
          .status(400)
          .json({ message: err });
        return;
      }
      res.status(200).json(aNewUser);

      // Automatically log in user after sign up
      // .login() here is actually predefined passport method
      /* req.login(aNewUser, (err) => {
        if (err) {
          res.status(500).json({ message: "Login after signup went bad." });
          return;
        }

        // Send the user's information to the frontend
        // We can use also: res.status(200).json(req.user);
        res.status(200).json(aNewUser);
      }); */

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
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
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

      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

/* LOGOUT ROUTE */
router.post("/logout", (req, res) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

/* LOGGEDIN */
router.get("/loggedin", (req, res) => {
  // req.isAuthenticated() is defined by passport
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

const uploadTSFiles = (req,res,next) => {
  const tsUpload = tsUploader("aa");
  console.log("TS UPLOAD", tsUpload)
  console.log("FILE UPLOADER", fileUploader)
  tsUpload.fields([{name: "model.json", maxCount: 1}, {name:"model.weights.bin", maxCount: 1}])
  .then(() => next());
}

router.post("/tsmodel/upload", (req, res) => {
  tsUploader(req.user._id)(req, res, function(err) {
    console.log(req.files);
    if (err) {
      console.log(err);
    }
    if (req.isAuthenticated()) {
      console.log(req.user._id);
    }
    //console.log(req.files["model.json"][0].path);
    User.findByIdAndUpdate({_id: req.user._id}, {tensorjson: req.files["model.json"][0].path, tensorbin: req.files["model.weights.bin"][0].path})
    .then((data) => res.status(200).json({message: "everything went well"}))
    .catch(err => console.log(err))
  })
  /* console.log(req.files["model.json"]);
  console.log(req.files["model.weights.bin"]);
  //console.log(req);
  console.log(req.session);
  console.log(req.user); */

})



module.exports = router;