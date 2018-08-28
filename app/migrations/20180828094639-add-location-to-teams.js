'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'teams',
				'location',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'cover_background'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('teams', 'location')
		];
	}
};