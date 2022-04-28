require('dotenv/config');
const router = require("express").Router();
const MovieDBService = require('../service/moviedb.service');
const movieDatabase = new MovieDBService();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  Promise.all([
    movieDatabase.getTrendingWeeklyMovies(),
    movieDatabase.getTrendingWeeklyTv()
  ])
  //response will produce array of all three data set requests
    .then((responseArray) => { 
      res.render("index", { 
        moviesArray: responseArray[0].data.results, 
        tvArray: responseArray[1].data.results
      })
    })
    .catch(error => console.log(error));
});

router.get("/people-list", isLoggedIn, (req, res, next) => {
  movieDatabase
  .getTrendingWeeklyPeople()
  .then((responseArray) => {
    res.render("people-list", { peopleArray: responseArray[2].data.results })
  })
  .catch(error => console.log(error));
})


router.get("/movie-details/:id", (req, res, next) => {
  const { id } = req.params;

  movieDatabase.getMovieDetails(id)
    .then((movieDetailsObject) => {
      console.log(movieDetailsObject)
      res.render("movie-details", movieDetailsObject.data);
    })
    .catch(error => console.log(error));

});

router.get("/tv-details/:id", (req, res, next) => {
  const { id } = req.params;

  res.render("tv-details", );
});

module.exports = router;