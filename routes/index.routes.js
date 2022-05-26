require("dotenv/config");
const router = require("express").Router();
const MovieDBService = require("../service/moviedb.service");
const movieDatabase = new MovieDBService();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { currentLanguage } = require("../service/moviedb.service");
const Watchlist = require("../models/Watchlist.model");

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session);
  Promise.all([
    movieDatabase.getTrendingWeeklyMovies(req.session.lang),
    movieDatabase.getTrendingWeeklyTv(req.session.lang),
  ])
    //response will produce array of all three data set requests
    .then((responseArray) => {
      // console.log(responseArray)
      if (req.session.lang !== "es") {
        res.render("en-index", {
          moviesArray: responseArray[0].data.results,
          tvArray: responseArray[1].data.results,
        });
      } else {
        res.render("es-index", {
          moviesArray: responseArray[0].data.results,
          tvArray: responseArray[1].data.results,
        });
      }
    })
    .catch((error) => console.log(error));
});

router.get("/people-list", isLoggedIn, (req, res, next) => {
  movieDatabase
    .getTrendingWeeklyPeople(req.session.lang)
    .then((responseArray) => {
      res.render("people-list", { peopleArray: responseArray.data.results });
    })
    .catch((error) => console.log(error));
});

router.get("/movie-details/:id", (req, res, next) => {
  const { id } = req.params;

  movieDatabase
    .getMovieDetails(id, req.session.lang)
    .then((movieDetailsObject) => {
      // console.log(movieDetailsObject)
      if (req.session.lang !== "es") {
        res.render("en-movie-details", movieDetailsObject.data);
      } else {
        res.render("es-movie-details", movieDetailsObject.data);
      }
    })
    .catch((error) => console.log(error));
});

router.get("/tv-details/:id", (req, res, next) => {
  const { id } = req.params;

  movieDatabase
    .getTvDetails(id, req.session.lang)
    .then((tvDetailsObject) => {
      if (req.session.lang !== "es") {
        res.render("en-tv-details", tvDetailsObject.data);
      } else {
        res.render("es-tv-details", tvDetailsObject.data);
      }
    })
    .catch((error) => console.log(error));
});

router.get("/watchlist-details/:id", (req, res, next) => {
  const { id } = req.params;

  Watchlist.findById(id, req.session.lang)
    .then((watchlistDetailsObject) => {
      if (req.session.lang !== "es") {
        res.render("en-user-watchlist", watchlistDetailsObject.data);
      } else {
        res.render("es-user-watchlist", watchlistDetailsObject.data);
      }
    })
    .catch((error) => console.log(error));
});

// watchlist details GET

router.get("/lang/:languageCode", (req, res, next) => {
  const { languageCode } = req.params;

  req.session.lang = languageCode;
  console.log(req.session);
  res.json({ message: "success" });
});

module.exports = router;
