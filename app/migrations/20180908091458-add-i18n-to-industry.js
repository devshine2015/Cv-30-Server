'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'industries',
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
			queryInterface.removeColumn('industries', 'title')
		];
	}
};