const express = require('express');
const Router = express.Router();
const wishController = require('../controllers/borrow');
const { verifyUser, verifyToken } = require('../helpers/auth');

Router.get('/:user_id', verifyToken, verifyUser, wishController.getBorrow);
Router.get(
	'/history/:user_id',
	verifyToken,
	verifyUser,
	wishController.getBorrowHistory
);
Router.post('/:user_id', verifyToken, verifyUser, wishController.addBorrow);
Router.patch('/:user_id', verifyToken, verifyUser, wishController.updateBorrow);

module.exports = Router;
