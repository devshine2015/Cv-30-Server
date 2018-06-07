'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('roles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING(50),
				allowNull: false,
				unique: true
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'created_at',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at'
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('roles');
	}
};