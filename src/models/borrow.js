const Sequelize = require('sequelize');
const db = require('../config/db');

const Borrow = db.define(
	'borrows',
	{
		borrow_id: {
			type: Sequelize.STRING,
			primaryKey: true,
		},
		user_id: {
			type: Sequelize.STRING,
		},
		date_borrow: Sequelize.DATEONLY,
		date_return: Sequelize.DATEONLY,
		returned: {
			type: Sequelize.BOOLEAN,
		},
		novel_id: {
			type: Sequelize.BOOLEAN,
		},
	},
	{ timestamps: false }
);

module.exports = Borrow;
