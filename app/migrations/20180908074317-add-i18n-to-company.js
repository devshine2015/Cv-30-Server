'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'companies',
				'headline',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'name'
				}
            ),
            queryInterface.addColumn(
				'companies',
				'description',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'name'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
            queryInterface.removeColumn('companies', 'headline'),
            queryInterface.removeColumn('companies', 'description')
		];
	}
};