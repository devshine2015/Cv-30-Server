'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		const date = new Date();
		const timestamps = { 
			created_at: date,
			updated_at: date
		};
		const jobTypeTitles = [ 'Full time', 'Part time', 'Project based', 'Remote', 'Internship', 'Traineesship'];
		return queryInterface.bulkInsert('job_types', jobTypeTitles.map((item, index) => ({
			id: index+1,
			...timestamps
		})))
		.then(() => queryInterface.bulkInsert('job_type_i18n', jobTypeTitles.map((item, index) => ({
			job_type_id: index+1,
			language_id: 1,
			title: item,
			...timestamps
		}))))
		.then(() => queryInterface.bulkInsert('job_type_i18n', jobTypeTitles.map((item, index) => ({
			job_type_id: index+1,
			language_id: 2,
			title: item,
			...timestamps
		}))));
	},

	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.bulkDelete('job_types', {}),
			queryInterface.bulkDelete('job_type_i18n', {})
		];
	}
};
