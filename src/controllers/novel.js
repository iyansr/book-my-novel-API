const Sequelize = require('sequelize');
const uuid = require('uuid/v4');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const Op = Sequelize.Op;
const { format } = require('date-fns');
const validateNovelInput = require('../helpers/validator/novel');
const HttpError = require('../helpers/HttpError');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const Novel = require('../models/novel');
const NovelStatus = require('../models/novel_status');
const Genre = require('../models/genres');

Novel.belongsTo(NovelStatus, { as: 'Status', foreignKey: 'status' });
Novel.belongsTo(Genre, { as: 'Genre', foreignKey: 'genre' });

module.exports = {
	//@method GET
	getNovel: async (req, res) => {
		try {
			const condition = {};
			let { author, title, status, genre, limit, page = 1 } = req.query;

			if (title) {
				condition.where = {
					title: {
						[Op.like]: `%${title}%`,
					},
				};
			}
			if (author) {
				condition.where = {
					author: {
						[Op.like]: `%${author}%`,
					},
				};
			}
			if (status) {
				condition.where = { ...condition.where, status };
			}
			if (genre) {
				condition.where = { ...condition.where, genre };
			}
			if (limit) {
				limit = Number.parseInt(limit < 1 ? 1 : limit);
				page = Number.parseInt(page < 1 ? 1 : page);

				condition.limit = limit;
				condition.offset = (page - 1) * limit;
			}
			const result = await Novel.findAndCountAll({
				include: [
					{
						as: 'Status',
						model: NovelStatus,
						attributes: ['novel_status'],
						required: true,
					},
					{
						as: 'Genre',
						model: Genre,
						attributes: ['genre'],
						required: true,
					},
				],
				attributes: {
					exclude: ['status', 'genre', 'updatedAt'],
				},
				...condition,
			});

			if (result.rows.length === 0) {
				throw new HttpError(404, 'Not Found', 'Cannot find any Novels');
			}

			const parsedResult = JSON.parse(JSON.stringify(result.rows));

			const finalResult = parsedResult.map(finalRes => {
				return {
					...finalRes,
					Status: finalRes.Status.novel_status,
					Genre: finalRes.Genre.genre,
					createdAt: moment(finalRes.createdAt).format('YYYY MMM DD'),
				};
			});

			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Success Fetching Data',
				totalData: result.count,
				result: finalResult,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	//@method GET
	findOneNovel: async (req, res) => {
		try {
			const U = jwt.decode(req.token);
			if (!(U.role !== 1 || U.Role !== 2)) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			} else {
				const data = await Novel.findByPk(req.params.id, {
					include: [
						{
							as: 'Status',
							model: NovelStatus,
							attributes: ['novel_status'],
							required: true,
						},
						{
							as: 'Genre',
							model: Genre,
							attributes: ['genre'],
							required: true,
						},
					],
					attributes: {
						exclude: ['status', 'genre', 'updatedAt'],
					},
				});
				if (!data)
					throw new HttpError(
						404,
						'Not Found',
						`Can't find product with id: ${req.params.id}`
					);

				const parsedResult = JSON.parse(JSON.stringify(data));

				const date = format(
					new Date(`${parsedResult.createdAt}`),
					'dd MMM yyyy'
				);
				const finalResult = {
					...parsedResult,
					createdAt: date,
					Status: parsedResult.Status.novel_status,
					Genre: parsedResult.Genre.genre,
				};
				// console.log(date);

				res.status(200).json(finalResult);
			}
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	//@method POST
	addNovel: async (req, res) => {
		try {
			const U = jwt.decode(req.token);
			if (U.role === 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			const body = {
				title: req.body.title,
				author: req.body.author,
				description: req.body.description,
				status: req.body.status,
				genre: req.body.genre,
				pages: req.body.pages,
				isbn: req.body.isbn,
				vendor: req.body.vendor,
				weight: req.body.weight,
				height: req.body.height,
				length: req.body.length,
			};

			const { image } = req.files || {};
			if (!image) {
				throw new HttpError(400, 'Bad Request', 'No File Selected');
			}
			const { errors, isValid } = validateNovelInput(body);
			const filetypes = /jpeg|jpg|png|gif/;
			const mimetype = filetypes.test(image.mimetype);
			if (!mimetype) {
				try {
					fs.unlinkSync(image.tempFilePath);
					throw new HttpError(400, 'Bad Request', 'File Must be an Image');
				} catch (err) {
					console.log(err);
				}
			}

			if (!isValid) {
				fs.unlink(image.tempFilePath, err => {
					if (err) {
						console.log('Cannot Delete File');
					}
				});
				throw new HttpError(400, 'Bad Request', errors);
			}

			const cloud = await cloudinary.uploader.upload(image.tempFilePath, {
				folder: 'upload/book-my-novel',
			});

			try {
				fs.unlinkSync(image.tempFilePath);
			} catch (err) {
				console.log(err);
			}

			const date = format(new Date(), 'yyyy-mm-dd');

			const id = uuid();

			Novel.create({
				novel_id: id,
				image: cloud.url,
				...body,
				created_at: date,
				updated_at: date,
			});

			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Succes Add Novel',
				data: {
					novel_id: id,
					image: cloud.url,
					...body,
					created_at: date,
					updated_at: date,
				},
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	//@method PATCH
	updateNovel: async (req, res) => {
		try {
			const U = jwt.decode(req.token);
			if (U.role !== 2) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			const novel = await Novel.findByPk(req.params.id);
			if (!novel)
				throw new HttpError(
					404,
					'Not Found',
					`Can't find product with id: ${req.params.id}`
				);
			const { image } = req.files || {};
			if (image) {
				const im = novel.image.split('/');
				if (!image) {
					throw new HttpError(400, 'Bad Request', 'No File Selected');
				}
				const filetypes = /jpeg|jpg|png|gif/;
				const mimetype = filetypes.test(image.mimetype);
				if (!mimetype) {
					try {
						fs.unlinkSync(image.tempFilePath);
						throw new HttpError(400, 'Bad Request', 'File Must be an Image');
					} catch (err) {
						console.log(err);
					}
				}

				const cloud = await cloudinary.uploader.upload(image.tempFilePath, {
					folder: 'upload/book-my-novel',
				});

				cloudinary.uploader.destroy(
					'upload/book-my-novel/' + im[im.length - 1].split('.')[0]
				);

				await Novel.update(
					{
						image: cloud.url,
					},
					{
						where: { novel_id: req.params.id },
					}
				);
				try {
					fs.unlinkSync(image.tempFilePath);
					throw new HttpError(400, 'Bad Request', 'File Must be an Image');
				} catch (err) {
					console.log(err);
				}
				res.json({
					code: 200,
					status: 'OK',
					message: 'Success Update Novel Image',
				});
			} else {
				await Novel.update(
					{
						...req.body,
					},
					{
						where: { novel_id: req.params.id },
					}
				);
				res.json({
					code: 200,
					status: 'OK',
					message: 'Success Update Novel',
				});
			}
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	//@method DELETE
	deleteNovel: async (req, res) => {
		try {
			const U = jwt.decode(req.token);
			if (U.role !== 2) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			const novel = await Novel.findByPk(req.params.id);
			if (!novel)
				throw new HttpError(
					404,
					'Not Found',
					`Can't find product with id: ${req.params.id}`
				);

			await Novel.destroy({
				where: {
					novel_id: req.params.id,
				},
			});
			const im = novel.image.split('/');

			cloudinary.uploader.destroy(
				'upload/book-my-novel/' + im[im.length - 1].split('.')[0]
			);

			res.json({
				code: 200,
				status: 'OK',
				message: 'Success Delete Novel',
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
};
