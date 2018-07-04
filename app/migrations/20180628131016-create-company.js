'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('companies', {
			id: {
				primaryKey: true,
				type: Sequelize.UUID,
				allowNull: false,
				validate: {
					isUUID: 4
				},
				field: 'id'
			},
			userId: {
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'user_id'
			},
			name: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'name',
				unique: true
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
		.then(() => queryInterface.addIndex('companies', ['user_id']))
		.then(() => queryInterface.addIndex('companies', { unique: true, fields: ['name'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('companies');
	}
};