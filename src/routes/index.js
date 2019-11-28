const express = require('express');
const Router = express.Router();

const novel = require('./novel');
const genre = require('./genre');
const status = require('./status');
const users = require('./user');
const wish = require('./borrow');

Router.use('/novel', novel);
Router.use('/genre', genre);
Router.use('/status', status);
Router.use('/users', users);
Router.use('/borrowlist', wish);

module.exports = Router;
