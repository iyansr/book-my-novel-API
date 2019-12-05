const NovelStatus = require('../models/novel_status');
const HttpError = require('../helpers/HttpError');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const moment = require('moment');
const Borrow = require('../models/borrow');
const Novel = require('../models/novel');

Borrow.belongsTo(Novel, { as: 'Novel', foreignKey: 'novel_id' });

module.exports = {
	getBorrow: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.params.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}
			const borrow = await Borrow.findAll({
				include: [
					{
						as: 'Novel',
						model: Novel,
						required: true,
					},
				],
				where: {
					user_id: req.params.user_id,
					returned: false,
				},
			});

			if (borrow.length === 0) {
				throw new HttpError(404, 'Not Found', 'Your Borrow List is Empty');
			}

			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Success Fetching Data',
				borrow,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	getBorrowHistory: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.params.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}
			const borrow = await Borrow.findAll({
				include: [
					{
						as: 'Novel',
						model: Novel,
						required: true,
					},
				],
				where: {
					user_id: req.params.user_id,
					returned: true,
				},
			});

			if (borrow.length === 0) {
				throw new HttpError(404, 'Not Found', 'Your Borrow List is Empty');
			}

			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Success Fetching Data',
				borrow,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	addBorrow: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.params.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}

			const novel = await Novel.findOne({
				where: {
					novel_id: req.body.novel_id,
				},
			});
			if (!novel) {
				throw new HttpError(404, 'NotFound', 'Novel Not Found');
			}
			const borrow = await Borrow.findAll({
				where: {
					user_id: req.params.user_id,
					returned: false,
				},
			});

			const isBorrowed = borrow.some(bor => {
				return bor.novel_id === req.body.novel_id;
			});

			if (isBorrowed)
				throw new HttpError(
					400,
					'Bad Request',
					'You Already Borrow This Novel'
				);

			let date = moment().format('YYYY-MM-DD');
			let formAtted = moment(date).format('YYYY MMM DD');
			console.log(formAtted);

			const borrowData = {
				borrow_id: uuid(),
				user_id: req.params.user_id,
				date_borrow: date,
				returned: false,
				novel_id: req.body.novel_id,
			};

			Borrow.create(borrowData);
			console.log(borrowData);
			console.log(date);

			res.json({
				code: 200,
				status: 'OK',
				message: 'Success Borrow',
				borrow: borrowData,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	updateBorrow: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.params.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}
			let date = moment().format('YYYY-MM-DD');

			await Borrow.update(
				{ returned: true, date_return: date },
				{
					where: {
						borrow_id: req.body.borrow_id,
						user_id: req.params.user_id,
						novel_id: req.body.novel_id,
					},
				}
			);
			res.json({
				code: 200,
				status: 'OK',
				message: 'Success Update Borrow',
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	checkBorrow: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.query.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}
			const borrow = await Borrow.findOne({
				where: {
					user_id: req.query.user_id,
					novel_id: req.query.novel_id,
					returned: false,
				},
			});
			if (!borrow) res.json(false);
			res.json(true);
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
};
