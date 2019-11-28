const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateNovelInput(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.author = !isEmpty(data.author) ? data.author : '';
	data.description = !isEmpty(data.description) ? data.description : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.genre = !isEmpty(data.genre) ? data.genre : '';
	data.pages = !isEmpty(data.pages) ? data.pages : '';
	data.isbn = !isEmpty(data.isbn) ? data.isbn : '';
	data.vendor = !isEmpty(data.vendor) ? data.vendor : '';
	data.weight = !isEmpty(data.weight) ? data.weight : '';
	data.height = !isEmpty(data.height) ? data.height : '';
	data.length = !isEmpty(data.length) ? data.length : '';

	if (Validator.isEmpty(data.title)) {
		errors.title = 'Title field is required';
	}
	if (Validator.isEmpty(data.author)) {
		errors.author = 'Author field is required';
	}
	if (Validator.isEmpty(data.description)) {
		errors.description = 'Description field is required';
	}
	if (Validator.isEmpty(data.status)) {
		errors.status = 'Status field is required';
	}
	if (Validator.isEmpty(data.genre)) {
		errors.genre = 'Genre field is required';
	}
	if (Validator.isEmpty(data.pages)) {
		errors.pages = 'Pages field is required';
	}
	if (Validator.isEmpty(data.isbn)) {
		errors.isbn = 'ISBN field is required';
	}
	if (Validator.isEmpty(data.vendor)) {
		errors.vendor = 'Vendor field is required';
	}
	if (Validator.isEmpty(data.weight)) {
		errors.weight = 'Weight field is required';
	}
	if (Validator.isEmpty(data.height)) {
		errors.height = 'Height field is required';
	}
	if (Validator.isEmpty(data.length)) {
		errors.length = 'Length field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
