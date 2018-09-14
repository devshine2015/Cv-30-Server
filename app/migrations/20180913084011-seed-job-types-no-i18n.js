'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		const date = new Date();
		const timestamps = { 
			created_at: date,
			updated_at: date
		};
		const jobTypeTitles = [ 'Full time', 'Part time', 'Project based', 'Remote', 'Internship', 'Traineesship'];
		
		return queryInterface.bulkInsert('job_types', jobTypeTitles.map(title => ({
			title,
			...timestamps
		})))
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.bulkDelete('job_types', {})
		];
	}
};
