const Sequelize = require('sequelize');

const dbName = process.env.DB_NAME; //|| 'book_my_novel';
const dbUser = process.env.DB_USER; //|| 'root';
const dbPassword = process.env.DB_PASSWORD; //|| '';
const dbHost = process.env.DB_HOST; //|| 'localhost';
const dbPort = process.env.DB_PORT; //|| 3306;

module.exports = new Sequelize(dbName, dbUser, dbPassword, {
	dialect: 'mysql',
	host: dbHost,
	port: dbPort,
	logging: false,
});
