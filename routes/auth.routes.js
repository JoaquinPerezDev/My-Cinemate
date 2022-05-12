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

router.get("/signup", isLoggedOut, (req, res, next) => {
    if(req.session.lang !== 'es') {                
      res.render("auth/en-signup")
    } else {
      res.render("auth/es-signup")
    } 

})


router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username) {
    if(req.session.lang !== 'es') {                
      return res.status(400).render("auth/en-signup", {
        errorMessage: "Please provide your username",
      });
    } else {
      return res.status(400).render("auth/es-signup", {
        errorMessage: "Incluya un nombre de usuario, por favor ",
      });
    } 
  }

  if (password.length < 8) {
    if(req.session.lang !== 'es') {                
      return res.status(400).render("auth/en-signup", {
        errorMessage: "Your password needs to be at least 8 characters long.",
      });
    } else {
      return res.status(400).render("auth/es-signup", {
        errorMessage: "Tu contraseña requiere un minimo de 8 caracteres.",
      });
    } 
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    if(req.session.lang !== 'es') {                
      return res.status(400).render("auth/en-signup", {
        errorMessage: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    } else {
      return res.status(400).render("auth/es-signup", {
        errorMessage: "Contraseñas requieren 8 caracteres, un minimo de un numero, una letra minuscula y una letra mayuscula.",
      });
    } 
  }

  User.findOne({ username }).then((found) => {
    if (found) {
      if(req.session.lang !== 'es') {                
        return res
        .status(400)
        .render("auth/en-signup", { errorMessage: "Username already taken." });
      } else {
        return res
        .status(400)
        .render("auth/es-signup", { errorMessage: "Nombre de usuario ya existe." });
      } 
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
          if(req.session.lang !== 'es') {                
            return res.status(400).render("auth/en-signup", {
              errorMessage: "Username need to be unique. The username you chose is already in use."
            });
          } else {
            return res.status(400).render("auth/es-signup", {
              errorMessage: "El nombre de usuario debe de ser unico. El nombre que has elegido ya existe."
            });
          } 
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res, next) => {
  if(req.session.lang !== 'es') {                
    res.render("auth/en-login");
  } else {
    res.render("auth/es-login");
  } 
})

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    if(req.session.lang !== 'es') {                
      return res.render('auth/en-login', {
        errorMessage: 'Please enter both username and password to login.'
      });
    } else {
      return res.render('auth/es-login', {
        errorMessage: 'Incluya numbre de usuario y contraseña por favor.'
      });
    } 

  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        if(req.session.lang !== 'es') {                
          res.status(400).render("auth/en-login", {
            errorMessage: "Username does not exist.",
          });
        } else {
          res.status(400).render("auth/es-login", {
            errorMessage: "Nombre de usuario no existe",
          });
        } 

      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          if(req.session.lang !== 'es') {                
            res.status(400).render("auth/en-login", {
              errorMessage: "Incorrect password",
            });
          } else {
            res.status(400).render("auth/login", {
              errorMessage: "Contraseña incorrecta",
            });
          } 

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
      if(req.session.lang !== 'es') {                
        return res
        .status(500)
        .render("auth/en-logout", { errorMessage: err.message });
      } else {
        return res
        .status(500)
        .render("auth/es-logout", { errorMessage: err.message });
      } 
    }
    res.redirect("/");
  });
});

router.get('/userProfile', isLoggedIn, (req, res, next) => {
  if(req.session.lang !== 'es') {                
    res.render('users/en-user-profile', { userInSession: req.session.currentUser });
  } else {
    res.render('users/es-user-profile', { userInSession: req.session.currentUser });

  } 
});


module.exports = router;
