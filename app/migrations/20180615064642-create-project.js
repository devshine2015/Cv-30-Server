const uuid = require('uuidv4');

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('projects', {
			id: {
				allowNull: false,
				primaryKey: true,
				defaultValue: uuid(),
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
				}
			},
			userId: {
				allowNull: false,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
				},
				field: 'user_id'
			},
			location: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'location'
			},
			isCurrent: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_current'
			},
			position: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			company: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			startDate: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'start_date'
			},
			endDate: {
				allowNull: true,
				type: Sequelize.DATE,
				field: 'end_date'
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
		.then(() => queryInterface.addIndex('projects', { fields: ['user_id'] }));
	},
	down: (queryInterface, Sequelize) => {
    	return queryInterface.dropTable('projects');
	}
};