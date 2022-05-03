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
      this.currentLanguage = 'es';
    }
   
    toggleLanguage = () => {
        if(this.currentLanguage == 'es') {
            this.currentLanguage = 'en'; 
        } else {
            this.currentLanguage = 'es';
        }
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