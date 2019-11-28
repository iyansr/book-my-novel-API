const Sequelize = require('sequelize');
const db = require('../config/db');

const Role = db.define('roles', {
	role_id: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	role: {
		type: Sequelize.INTEGER,
		required: true,
	},
});

module.exports = Role;
