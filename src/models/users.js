const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define(
	'users',
	{
		user_id: {
			type: Sequelize.STRING,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING,
			required: true,
		},
		email: {
			type: Sequelize.STRING,
			required: true,
		},
		password: {
			type: Sequelize.STRING,
			required: true,
		},
		avatar: {
			type: Sequelize.STRING,
		},
		role: {
			type: Sequelize.INTEGER,
			required: true,
		},
		createdAt: {
			type: Sequelize.DATEONLY,
		},
		updatedAt: {
			type: Sequelize.DATEONLY,
		},
	},
	{ underscored: true }
);

module.exports = User;
