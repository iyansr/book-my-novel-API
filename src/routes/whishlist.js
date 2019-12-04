const express = require('express');
const Router = express.Router();
const whishController = require('../controllers/whishlist');
const { verifyUser, verifyToken } = require('../helpers/auth');

Router.get('/:user_id', verifyToken, verifyUser, whishController.getWhish);
Router.post('/:user_id', verifyToken, verifyUser, whishController.addWhish);
Router.delete(
	'/delete/whish',
	verifyToken,
	verifyUser,
	whishController.removeWhish
);

module.exports = Router;
