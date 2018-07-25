'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'jobs',
				'location',
				{
					allowNull: true,
					type: Sequelize.STRING(255)
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('jobs', 'location')
		];
	}
};