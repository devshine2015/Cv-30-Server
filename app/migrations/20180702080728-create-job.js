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
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('jobs');
	}
};