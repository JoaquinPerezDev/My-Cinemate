require('dotenv/config');
const router = require("express").Router();
const MovieDBService = require('../service/moviedb.service');
const movieDatabase = new MovieDBService();



/* GET home page */
router.get("/", (req, res, next) => {
  Promise.all([
    movieDatabase.getTrendingWeeklyMovies(),
    movieDatabase.getTrendingWeeklyTv(),
    movieDatabase.getTrendingWeeklyPeople()
  ])
  //response will produce array of all three data set requests
    .then((responseArray) => { 
      console.log(responseArray)
      res.render("index", { 
        moviesArray: responseArray[0].data.results, 
        tvArray: responseArray[1].data.results, 
        peopleArray: responseArray[2].data.results })
    })
    .catch(error => console.log(error));
});



module.exports = router;