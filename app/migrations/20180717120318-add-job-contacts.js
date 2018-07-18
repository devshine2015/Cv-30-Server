'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'jobs',
				'phone',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					field: 'phone'
				}
			),
			queryInterface.addColumn(
				'jobs',
				'email',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					field: 'email'
				}
			),
			queryInterface.addColumn(
				'jobs',
				'facebook',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					field: 'facebook'
				}
			),
			queryInterface.addColumn(
				'jobs',
				'linkedin',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					field: 'linkedin'
				}
			)
		];
	},
  	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('jobs', 'phone'),
			queryInterface.removeColumn('jobs', 'email'),
			queryInterface.removeColumn('jobs', 'facebook'),
			queryInterface.removeColumn('jobs', 'linkedin')
		];
	}
};
