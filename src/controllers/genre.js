const Genre = require('../models/genres');
const HttpError = require('../helpers/HttpError');

module.exports = {
	getAllGenre: async (req, res) => {
		try {
			const genre = await Genre.findAll({
				attributes: {
					exclude: ['updatedAt', 'createdAt'],
				},
			});
			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Success Fetching Data',
				genre,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
};
