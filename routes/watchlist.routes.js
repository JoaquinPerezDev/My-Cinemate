const router = require("express").Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const MovieDBService = require('../service/moviedb.service');
const movieDatabase = new MovieDBService();


// Routes needed: 
// 1 & 2. watchlist create GET & POST
// 3 & 4. watchlist edit GET & POST
// 5.     watchlist delete GT & POST
// 6.     watchlist details GET ((This goes in index.routes.js))