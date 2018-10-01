'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'education',
			'title',
			{
				allowNull: true,
				type: Sequelize.STRING(255),
				after: 'id'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'education',
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
			queryInterface.removeColumn('education', 'title'),
			queryInterface.removeColumn('education', 'description')
		];
	}
};