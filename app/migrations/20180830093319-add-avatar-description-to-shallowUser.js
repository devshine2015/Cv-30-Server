'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'shallow_users',
				'description',
				{
					type: Sequelize.TEXT,
					allowNull: true,
					after: 'position'
				}
			),
			queryInterface.addColumn(
				'shallow_users',
				'avatar_path',
				{
					type: Sequelize.TEXT,
					allowNull: true,
					after: 'position'
				}
			)
		]
	},

	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('shallow_users', 'description'),
			queryInterface.removeColumn('shallow_users', 'avatar_path')
		];
	}
};
