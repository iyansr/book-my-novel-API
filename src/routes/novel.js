const express = require('express');
const Router = express.Router();
const { verifyUser, verifyToken } = require('../helpers/auth');

const {
	getNovel,
	findOneNovel,
	addNovel,
	updateNovel,
	deleteNovel,
} = require('../controllers/novel');

Router.get('/', getNovel);
Router.get('/detail/:id', verifyToken, verifyUser, findOneNovel);
Router.post('/', verifyToken, verifyUser, addNovel);
Router.patch('/update/:id', verifyToken, verifyUser, updateNovel);
Router.delete('/delete/:id', verifyToken, verifyUser, deleteNovel);

module.exports = Router;
