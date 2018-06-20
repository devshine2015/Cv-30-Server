'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('salaries', {
			userId: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
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
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('salaries');
	}
};