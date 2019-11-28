const Sequelize = require('sequelize');
const db = require('../config/db');

const Genre = db.define('genres', {
	genre_id: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	genre: Sequelize.STRING,
});

module.exports = Genre;
