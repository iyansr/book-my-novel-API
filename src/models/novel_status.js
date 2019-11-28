const Sequelize = require('sequelize');
const db = require('../config/db');

const NovelStatus = db.define('novel_statuses', {
	status_id: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	novel_status: Sequelize.STRING,
});

module.exports = NovelStatus;
