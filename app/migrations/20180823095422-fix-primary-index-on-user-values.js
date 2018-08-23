'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('user_values', 'id')
			.then(() =>	queryInterface.addConstraint('user_values', ['user_id', 'value_id'], { type: 'primary key' }));
	},

	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeIndex('user_values', 'PRIMARY'),
			queryInterface.addColumn(
				'user_values',
				'id',
				{
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
					first: true
				}
			)
		];
	}
};
