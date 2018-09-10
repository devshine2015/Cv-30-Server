'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'job_types',
				'title',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'id'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('job_types', 'title')
		];
	}
};