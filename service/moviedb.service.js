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
   

    getTrendingWeeklyMovies = (lang) => {
        
      return this.api.get(`/trending/movie/week?language=${lang}`);
    };
   
    getTrendingWeeklyTv = (lang) => {
        return this.api.get(`/trending/tv/week?language=${lang}`);
    };
    
    getTrendingWeeklyPeople = (lang) => {
        return this.api.get(`/trending/person/week?language=${lang}`);
    };
    
    getTrendingDailyMovies = (lang) => {
        return this.api.get(`/trending/movie/day?language=${lang}`);
    };
     
    getTrendingDailyTv = (lang) => {
        return this.api.get(`/trending/tv/day?language=${lang}`);
    };
    
    getTrendingDailyPeople = (lang) => {
        return this.api.get(`/trending/person/day?language=${lang}`);
    };

    getMovieDetails = (movieId, lang) => {
        return this.api.get(`/movie/${movieId}?language=${lang}`);
    }

    getTvDetails = (tvId, lang) => {
        return this.api.get(`/tv/${tvId}?language=${lang}`);
    }

}
   
  module.exports = MovieDBService;