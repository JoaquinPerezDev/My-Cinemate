require("dotenv/config");
const MovieDbService = require('../service/moviedb.service');



const testService = new MovieDbService();

testService.getTrendingWeeklyMovies()
    .then(res => { //replace with 
        // console.log(data)
        res.data.results.forEach(element => {
            console.log(element)
        })
        
    })
    .catch(error => console.log(error));