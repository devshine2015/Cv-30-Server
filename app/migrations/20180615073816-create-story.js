'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('stories', {
			userId: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'user_id'
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
			createdAt: 'created_at',
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('stories');
	}
};