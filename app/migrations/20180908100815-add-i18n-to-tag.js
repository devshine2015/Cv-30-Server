'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'tags',
				'title',
				{
					allowNull: true,
					type: Sequelize.STRING(100),
					after: 'id'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('tags', 'title')
		];
	}
};