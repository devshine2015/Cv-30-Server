'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'videos',
			'title',
			{
				allowNull: true,
				type: Sequelize.TEXT,
				after: 'path'
			}
		)
		.then(() =>
            queryInterface.addColumn(
				'videos',
				'description',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'title'
				}
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('videos', 'title'),
            queryInterface.removeColumn('videos', 'description')
		];
	}
};