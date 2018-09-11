'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'images',
			'title',
			{
				allowNull: true,
				type: Sequelize.TEXT,
				after: 'path'
			}
		)
		.then(() =>
            queryInterface.addColumn(
				'images',
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
			queryInterface.removeColumn('images', 'title'),
            queryInterface.removeColumn('images', 'description')
		];
	}
};