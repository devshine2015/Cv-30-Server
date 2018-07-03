'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('jobs', {
			id: {
				primaryKey: true,
				type: Sequelize.UUID,
				allowNull: false,
				validate: {
					isUUID: 4
				},
				field: 'id'
			},
			companyId: {
				type: Sequelize.UUID,
				allowNull: false,
				validate: {
					isUUID: 4
				},
				field: 'company_id'
			},
			teamId: {
				type: Sequelize.UUID,
				allowNull: false,
				validate: {
					isUUID: 4
				},
				field: 'team_id'
			},
			expireDate: {
				allowNull: true,
				type: Sequelize.DATE,
				field: 'expire_date'
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
		})
		.then(() => queryInterface.addIndex('jobs', { fields: ['company_id'] }))
		.then(() => queryInterface.addIndex('jobs', { fields: ['team_id'] }))
		.then(() => queryInterface.addIndex('jobs', { fields: ['team_id', 'company_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('jobs');
	}
};