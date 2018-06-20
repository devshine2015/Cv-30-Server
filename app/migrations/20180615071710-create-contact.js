'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('contacts', {
			userId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'user_id',
			},
			phone: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'phone_numbers'
			},
			email: {
				allowNull: true,
				type: Sequelize.STRING(255)
			},
			fb: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'facebook'
			},
			linkedin: {
				allowNull: true,
				type: Sequelize.STRING(255)
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
		}, {
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('contacts');
	}
};