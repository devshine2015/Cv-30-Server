'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return ['name', 'activity_field', 'no_of_employees', 'location', 'companies_name'].map(item => queryInterface.removeConstraint(
			'companies',
			item
		));
	},
	down: (queryInterface, Sequelize) => {
		return ['name', 'activity_field', 'no_of_employees', 'location', 'companies_name'].map(item => queryInterface.addConstraint(
			'companies',
			[item === 'companies_name' ? 'name' : item],
			{
				type: 'UNIQUE',
				name: item
			}
		));
	}
};
