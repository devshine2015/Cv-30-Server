'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'users',
				'god',
				{
					allowNull: false,
					defaultValue: false,
					type: Sequelize.BOOLEAN,
					after: 'activation_token'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('users', 'god')
		];
	}
};
