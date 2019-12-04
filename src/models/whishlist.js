// whishlists;
const Sequelize = require('sequelize');
const db = require('../config/db');

const Whishlist = db.define(
	'whishlists',
	{
		wish_id: {
			type: Sequelize.STRING,
			primaryKey: true,
		},
		user_id: {
			type: Sequelize.STRING,
		},
		novel_id: {
			type: Sequelize.STRING,
		},
	},
	{ timestamps: false }
);

module.exports = Whishlist;
