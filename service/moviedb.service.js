//add a class that will fetch all the info from the movie DB api

const axios = require('axios');
 
class MovieDBService {
    constructor() {
      this.api = axios.create({
        baseURL: 'https://api.themoviedb.org/3',
        headers: { 
            'Authorization': `Bearer ${process.env.MOVIEDB_TOKEN}`,
            'Content-Type': 'application/json;charset=utf-8' 
        } 
      });
    }
   
    getTrendingWeeklyMovies = () => {
      return this.api.get('/trending/movie/week');
    };
   
    getTrendingWeeklyTv = () => {
        return this.api.get('/trending/tv/week');
    };
    
    getTrendingWeeklyPeople = () => {
        return this.api.get('/trending/person/week');
    };
    
    getTrendingDailyMovies = () => {
        return this.api.get('/trending/movie/day');
    };
     
    getTrendingDailyTv = () => {
        return this.api.get('/trending/tv/day');
    };
    
    getTrendingDailyPeople = () => {
        return this.api.get('/trending/person/day');
    };

    getMovieDetails = (movieId) => {
        return this.api.get(`/movie/${movieId}`);
    }

    getTvDetails = (tvId) => {
        return this.api.get(`/tv/${tvId}`);
    }

}
   
  module.exports = MovieDBService;