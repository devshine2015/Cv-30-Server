'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('salaries', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'user_id'
			},
			isPublic: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_public'
			},
			currency: {
				allowNull: true,
				defaultValue: 'ron',
				type: Sequelize.ENUM('eur', 'ron'),
				field: 'currency'
			},
			amount: {
				allowNull: true,
				defaultValue: 0,
				type: Sequelize.DOUBLE(14,2),
				field: 'amount'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'created_at'
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at'
			}
		})
		.then(() => queryInterface.addIndex('salaries', { fields: ['user_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('salaries');
	}
};