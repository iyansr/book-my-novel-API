const HttpError = require('../helpers/HttpError');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const Whishlist = require('../models/whishlist');
const Novel = require('../models/novel');

Whishlist.belongsTo(Novel, { as: 'Novel', foreignKey: 'novel_id' });

module.exports = {
	getWhish: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.params.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}
			const whish = await Whishlist.findAll({
				include: [
					{
						as: 'Novel',
						model: Novel,
						required: true,
					},
				],
				where: {
					user_id: req.params.user_id,
				},
			});
			res.json(whish);
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	addWhish: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.params.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}
			const getWhish = await Whishlist.findAll({
				where: {
					user_id: req.params.user_id,
				},
			});
			const isWhished = getWhish.some(whish => {
				return whish.novel_id === req.body.novel_id;
			});
			if (isWhished)
				throw new HttpError(
					400,
					'Bad Request',
					'You Already Borrow This Novel'
				);
			const whishData = {
				wish_id: uuid(),
				user_id: req.params.user_id,
				novel_id: req.body.novel_id,
			};
			Whishlist.create(whishData);
			res.json({
				code: 200,
				status: 'OK',
				message: 'Success Whishlist',
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	removeWhish: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.query.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}
			await Whishlist.destroy({
				where: {
					wish_id: req.query.whish_id,
				},
			});
			res.json({
				code: 200,
				status: 'OK',
				message: 'Success Delete Whish',
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	checkWhislist: async (req, res) => {
		try {
			const TOKEN = jwt.decode(req.token);
			if (TOKEN.role !== 1) {
				throw new HttpError(403, 'Forbidden', 'Cannot do this');
			}
			if (TOKEN.user_id !== req.query.user_id) {
				throw new HttpError(405, 'Not Allowed', 'Cannot do this');
			}

			const whish = await Whishlist.findOne({
				where: {
					user_id: req.query.user_id,
					novel_id: req.query.novel_id,
				},
			});

			if (!whish) return res.json(false);

			res.json(true);
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
};
