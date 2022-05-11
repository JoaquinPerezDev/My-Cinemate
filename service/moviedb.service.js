//add a class that will fetch all the info from the movie DB api

const axios = require('axios');
 
class MovieDBService {
    static currentLanguage = 'es';

    constructor() {
      this.api = axios.create({
        baseURL: 'https://api.themoviedb.org/3',
        headers: { 
            'Authorization': `Bearer ${process.env.MOVIEDB_TOKEN}`,
            'Content-Type': 'application/json;charset=utf-8' 
        } 
      });
      this.currentLanguage = 'es';
    }
   
    toggleLanguage = (lang) => {
        this.currentLanguage = lang;
        //toggles between any language, stored in our session. for future additions to languages.
    }

    getTrendingWeeklyMovies = () => {
      return this.api.get(`/trending/movie/week?language=${this.currentLanguage}`);
    };
   
    getTrendingWeeklyTv = () => {
        return this.api.get(`/trending/tv/week?language=${this.currentLanguage}`);
    };
    
    getTrendingWeeklyPeople = () => {
        return this.api.get(`/trending/person/week?language=${this.currentLanguage}`);
    };
    
    getTrendingDailyMovies = () => {
        return this.api.get(`/trending/movie/day?language=${this.currentLanguage}`);
    };
     
    getTrendingDailyTv = () => {
        return this.api.get(`/trending/tv/day?language=${this.currentLanguage}`);
    };
    
    getTrendingDailyPeople = () => {
        return this.api.get(`/trending/person/day?language=${this.currentLanguage}`);
    };

    getMovieDetails = (movieId) => {
        return this.api.get(`/movie/${movieId}?language=${this.currentLanguage}`);
    }

    getTvDetails = (tvId) => {
        return this.api.get(`/tv/${tvId}?language=${this.currentLanguage}`);
    }

}
   
  module.exports = MovieDBService;