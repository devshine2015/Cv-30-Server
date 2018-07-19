'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('user_followers', {
			user_id: {
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
                allowNull: false
			},
			follower_id: {
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
                allowNull: false
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
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('user_followers');
	}
};
