const User = require('../models/users');
const Role = require('../models/role');
const { hashSync, genSaltSync, compareSync } = require('bcryptjs');
const uuid = require('uuid/v4');
// const { format } = require('date-fns');
const { sign } = require('jsonwebtoken');
const {
	validateLoginInput,
	validateRegisterInput,
} = require('../helpers/validator/user');

const HttpError = require('../helpers/HttpError');

User.belongsTo(Role, { as: 'Role', foreignKey: 'role' });

module.exports = {
	getAllUser: async (req, res) => {
		try {
			const user = await User.findAll({
				include: [
					{
						as: 'Role',
						model: Role,
						attributes: ['role'],
						required: true,
					},
				],
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'role', 'password'],
				},
				where: {
					role: 1,
				},
			});
			const parsedUser = JSON.parse(JSON.stringify(user));
			const finalUser = parsedUser.map(user => {
				return {
					...user,
					Role: user.Role.role,
				};
			});
			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Success Fetching Data',
				user: finalUser,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	registerUser: async (req, res) => {
		try {
			const { errors, isValid } = validateRegisterInput(req.body);

			if (!isValid) {
				throw new HttpError(400, 'Bad Request', errors);
			}

			const user = await User.findOne({
				where: {
					email: req.body.email,
				},
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
				},
			});

			if (user) {
				if (user.email === req.body.email) {
					throw new HttpError(400, 'Bad Request', {
						email: `User with email ${req.body.email} already exist!`,
					});
				}
			}

			const salt = genSaltSync(10);
			const password = hashSync(req.body.password, salt);
			const data = {
				user_id: uuid(),
				...req.body,
				password,
			};

			await User.create(data);
			delete data.password;

			res.json({
				code: 200,
				status: 'OK',
				message: 'Succes Register User',
				data,
			});
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	loginUser: async (req, res) => {
		try {
			const { errors, isValid } = validateLoginInput(req.body);

			if (!isValid) {
				throw new HttpError(400, 'Bad Request', errors);
			}

			const user = await User.findOne({
				where: {
					email: req.body.email,
					role: 1,
				},
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
				},
			});

			if (!user) {
				throw new HttpError(400, 'Bad Reqxuest', {
					email: `Cannot find user with email ${req.body.email}`,
				});
			}

			const parsedUser = JSON.parse(JSON.stringify(user));

			if (compareSync(req.body.password, parsedUser.password)) {
				delete parsedUser.password;
				const token = sign(parsedUser, process.env.JWT_SECRET);
				res.json(token);
			} else {
				throw new HttpError(400, 'Bad Request', {
					password: `Wrong Password`,
				});
			}
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
	loginAdmin: async (req, res) => {
		try {
			const { errors, isValid } = validateLoginInput(req.body);

			if (!isValid) {
				throw new HttpError(400, 'Bad Request', errors);
			}
			const user = await User.findOne({
				where: {
					email: req.body.email,
					role: 2,
				},
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
				},
			});

			if (!user) {
				throw new HttpError(400, 'Bad Reqxuest', {
					email: `Cannot find user with email ${req.body.email}`,
				});
			}
			const parsedUser = JSON.parse(JSON.stringify(user));

			if (compareSync(req.body.password, parsedUser.password)) {
				delete parsedUser.password;
				const token = sign(parsedUser, process.env.JWT_SECRET, {
					expiresIn: '7days',
				});
				res.json(token);
			} else {
				throw new HttpError(400, 'Bad Request', {
					password: `Wrong Password`,
				});
			}
		} catch (error) {
			HttpError.handle(res, error);
		}
	},
};
