'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'stories',
				'title',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'user_id'
				}
			),
            queryInterface.addColumn(
				'stories',
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
			queryInterface.removeColumn('stories', 'title'),
            queryInterface.removeColumn('stories', 'description')
		];
	}
};