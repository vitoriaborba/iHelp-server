const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
// const isLoggedOut = require("../middleware/isLoggedOut");
// const isLoggedIn = require("../middleware/isLoggedIn");
const { isAuthenticated } = require('../middleware/jwt.middleware');


router.get('/verify', isAuthenticated, (req, res, next) => {
  console.log('req.payload', req.payload);

  res.status(200).json(req.payload);
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }

  if (!email) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your email." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res.status(400).json({ errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          email,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        res.status(201).json(user);
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "Username and email need to be unique. The username or email you chose is already in use.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }

        //jwt
        const { _id, username } = user;
        const payload = { _id, username };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: 'HS256',
          expiresIn: '24h',
        });
       
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
           return res.status(200).json({ authToken });
       
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get('/users', isAuthenticated, (req, res, next) => {
  User.find()
    .then((response) => res.json(response))
    .catch((err) => next(err));
});
router.get('/user/:id', isAuthenticated, (req, res, next) => {
  const {id} = req.params
  User.findById(id)
    .populate('posts', 'postsCompleted') 
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

router.put('/user/:userId', isAuthenticated, (req, res, next) => {
  const {userId} = req.params;
  const {username, email, password} = req.body;
  let image;
  if (req.file) {
    image = req.file.path;
}        

  User.findByIdAndUpdate(userId, {username, email, image, password} , {new: true})
  .then((response) => res.json(response))
  .catch((err) => res.json(err))
 
});

module.exports = router;
