'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'projects',
				'title',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'user_id'
				}
			),
	            queryInterface.addColumn(
				'projects',
				'description',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'title'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('projects', 'title'),
	            queryInterface.removeColumn('projects', 'description')
		];
	}
};