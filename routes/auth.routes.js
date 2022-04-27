require('dotenv/config');
const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const MovieDBService = require('../service/moviedb.service');

const saltRounds = 12;

const User = require("../models/User.model");
const Post = require("../models/Post.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res, next) => res.render("auth/signup"));

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your username.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  User.findOne({ username }).then((found) => {
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Username already taken." });
    }

    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          email, 
          password: hashedPassword,
        });
      })
      .then((user) => {
        req.session.currentUser = user;
        res.redirect("/");

      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage: "Username need to be unique. The username you chose is already in use."
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res, next) => res.render("auth/login"));

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both username and password to login.'
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
          res.status(400).render("auth/login", {
          errorMessage: "Username does not exist.",
        });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
            res.status(400).render("auth/login", {
            errorMessage: "Incorrect password",
          });
        }
        req.session.currentUser = user;
        res.redirect("/");
      });
    })

    .catch((err) => {
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

router.get('/userProfile', isLoggedIn, (req, res, next) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});


module.exports = router;
