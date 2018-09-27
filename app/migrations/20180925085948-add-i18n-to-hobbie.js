'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'hobby',
			'title',
			{
				allowNull: true,
				type: Sequelize.STRING(255),
				after: 'id'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'hobby',
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
			queryInterface.removeColumn('hobby', 'title'),
			queryInterface.removeColumn('hobby', 'description')
		];
	}
};