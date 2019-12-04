const express = require('express');
const Router = express.Router();
const borrowController = require('../controllers/borrow');
const { verifyUser, verifyToken } = require('../helpers/auth');

Router.get('/:user_id', verifyToken, verifyUser, borrowController.getBorrow);
Router.get(
	'/check/borrow',
	verifyToken,
	verifyUser,
	borrowController.checkBorrow
);
Router.get(
	'/history/:user_id',
	verifyToken,
	verifyUser,
	borrowController.getBorrowHistory
);
Router.post('/:user_id', verifyToken, verifyUser, borrowController.addBorrow);
Router.patch(
	'/:user_id',
	verifyToken,
	verifyUser,
	borrowController.updateBorrow
);

module.exports = Router;
