'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'experience',
			'title',
			{
				allowNull: true,
				type: Sequelize.STRING(255),
				after: 'id'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'experience',
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
			queryInterface.removeColumn('experience', 'title'),
			queryInterface.removeColumn('experience', 'description')
		];
	}
};