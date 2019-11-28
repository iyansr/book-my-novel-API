const NovelStatus = require('../models/novel_status');
const HttpError = require('../helpers/HttpError');

module.exports = {
	getAllStatus: async (req, res) => {
		try {
			const novelStatus = await NovelStatus.findAll({
				attributes: ['status_id', ['novel_status', 'status']],
			});
			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Success Fetching Data',
				novel_status: novelStatus,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
};
