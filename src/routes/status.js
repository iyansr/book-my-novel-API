const express = require('express');
const Router = express.Router();
const { getAllStatus } = require('../controllers/status');

Router.get('/', getAllStatus);

module.exports = Router;
