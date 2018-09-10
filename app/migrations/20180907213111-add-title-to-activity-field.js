'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'activity_fields',
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
			queryInterface.removeColumn('activity_fields', 'title')
		];
	}
};
