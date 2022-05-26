const router = require("express").Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const MovieDBService = require("../service/moviedb.service");
const movieDatabase = new MovieDBService();

// Routes needed:
// 1 & 2. watchlist create GET & POST

router.get("/watchlist/create", isLoggedIn, (req, res, next) => {
  let movieId, tvId;
  if (req.query.movieId) {
    movieId = req.query.movieId;
    User.findById(req.session.currentUser._id)
      .then((dbUser) => {
        if (req.session.lang !== "es") {
          res.render("watchlists/en-create-watchlist", { dbUser, movieId });
        } else {
          res.render("watchlists/es-create-watchlist", { dbUser, movieId });
        }
      })
      .catch((err) => console.log(`error while displaying the post: ${err}`));
  } else {
    tvId = req.query.tvId;
    User.findById(req.session.currentUser._id)
      .then((dbUser) => {
        if (req.session.lang !== "es") {
          res.render("watchlists/en-user-watchlist", { dbUser, tvId });
        } else {
          res.render("watchlists/es-user-watchlist", { dbUser, tvId });
        }
      })
      .catch((err) => console.log(`error while displaying the post: ${err}`));
  }
});

router.post("/watchlists/create", isLoggedIn, (req, res, next) => {
  const { title, content, rating } = req.body;
  let movieId, tvId;
  const author = req.session.currentUser._id;

  if (req.query.movieId) {
    movieId = req.query.movieId;
    Watchilist.create({ title, content, rating, movieId, author })
      .then((dbWatchlists) => {
        return User.findByIdAndUpdate(author, {
          $push: { watchlists: dbWatchlists._id },
        });
      })
      .then(() => {
        if (req.session.lang !== "es") {
          res.redirect("/en-user-watchlist");
        } else {
          res.redirect("/es-user-watchlist");
        }
      })

      .catch((err) => {
        throw new Error(`Error while creating the post! ${err}`);
      });
  } else {
    tvId = req.query.tvId;
    Watchlist.create({ title, content, rating, tvId, author })
      .then((dbWatchlists) => {
        return User.findByIdAndUpdate(author, {
          $push: { watchlists: dbWatchlists._id },
        });
      })
      .then(() => {
        if (req.session.lang !== "es") {
          res.redirect("/en-user-watchlist");
        } else {
          res.redirect("/es-user-watchlist");
        }
      })
      .catch((err) => {
        throw new Error(`Error while creating the post! ${err}`);
      });
  }
});

// 3 & 4. watchlist edit GET & POST
// 5.     watchlist delete GET & POST
// 6.     watchlist details GET ((This goes in index.routes.js))

module.exports = router;
