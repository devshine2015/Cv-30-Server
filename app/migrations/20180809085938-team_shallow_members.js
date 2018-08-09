'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('team_shallow_members', {
			teamId: {
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				allowNull: false,
				field: 'team_id'
			},
			shalloUserId: {
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				allowNull: false,
				field: 'shallow_user_id'
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
		return queryInterface.dropTable('team_shallow_members');
	}
};
