require('dotenv').config();
const http = require('http');
const express = require('express');
const db = require('./src/config/db');
const route = require('./src/routes');
const cors = require('cors');
const fileUploads = require('express-fileupload');
// const morgan = require('morgan');

const server = express();
const PORT = 9600 || process.env.PORT;

server.use(cors());
// server.use(morgan('dev'));
server.use(express.static('./public'));
server.use(
	fileUploads({
		useTempFiles: true,
		tempFileDir: './public/img',
	})
);
server.use('/api/v2', route);

server.get('/', (req, res) => {
	res.json({
		code: 200,
		status: 'OK',
		message: 'Welome To Book My Novel API',
	});
});

server.get('*', (req, res) => {
	res.status(404).json({
		code: 404,
		status: 'Not Found',
		message: `Cannot get ${req.path}`,
	});
});

const start = async () => {
	try {
		await db.authenticate();
		http.createServer(server).listen(PORT, () => {
			console.log(`Server running on htpp://127.0.0.1:${PORT}`);
		});
	} catch (error) {
		console.log('An error occured whil connecting to database:', error);
	}
};

start();
