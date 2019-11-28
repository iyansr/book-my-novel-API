const express = require('express');
const Router = express.Router();
const genreController = require('../controllers/genre');

Router.get('/', genreController.getAllGenre);

module.exports = Router;
