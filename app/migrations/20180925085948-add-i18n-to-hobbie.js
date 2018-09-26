'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'hobbie',
			'title',
			{
				allowNull: true,
				type: Sequelize.STRING(255),
				after: 'id'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'hobbie',
				'description',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'id'
				}
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('hobbie', 'title'),
			queryInterface.removeColumn('hobbie', 'description')
		];
	}
};