const express = require('express');
const Router = express.Router();
const { verifyAdmin, verifyToken } = require('../helpers/auth');
const {
	getAllUser,
	registerUser,
	loginUser,
	loginAdmin,
} = require('../controllers/user');

Router.get('/', verifyToken, verifyAdmin, getAllUser);
Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.post('/login/admin', loginAdmin);

module.exports = Router;
