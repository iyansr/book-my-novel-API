const Sequelize = require('sequelize');
const db = require('../config/db');

const Novel = db.define(
	'novels',
	{
		novel_id: {
			type: Sequelize.STRING,
			primaryKey: true,
		},
		title: Sequelize.STRING,
		author: Sequelize.STRING,
		image: Sequelize.STRING,
		description: Sequelize.TEXT,
		status: Sequelize.INTEGER,
		genre: Sequelize.INTEGER,
		pages: Sequelize.INTEGER,
		isbn: Sequelize.STRING,
		vendor: Sequelize.STRING,
		weight: Sequelize.FLOAT,
		height: Sequelize.FLOAT,
		length: Sequelize.FLOAT,
		createdAt: Sequelize.DATEONLY,
		updatedAt: Sequelize.DATEONLY,
	},
	{ underscored: true }
);

module.exports = Novel;
