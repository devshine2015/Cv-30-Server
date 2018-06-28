const uuid = require('uuidv4');

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('experience', {
			id: {
				allowNull: false,
				type: Sequelize.UUID,
				defaultValue: uuid(),
                validate: {
                    isUUID: 4
                },
				primaryKey: true
			},
			userId: {
				allowNull: false,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				field: 'user_id'
			},
			locationId: {
				allowNull: true,
				type: Sequelize.INTEGER,
				field: 'location_id'
			},
			isCurrent: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_current'
			},
			position: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			company: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			startDate: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'start_date'
			},
			endDate: {
				allowNull: false,
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
			createdAt: 'created_at',
			freezeTableName: true,
			tableName: 'experience'
		})
		.then(() => queryInterface.addIndex('experience', { fields: ['user_id'] }))
		.then(() => queryInterface.addIndex('experience', { fields: ['location_id'] }))
		.then(() => queryInterface.addIndex('experience', { fields: ['user_id', 'location_id'] }));
	},
	down: (queryInterface, Sequelize) => {
    	return queryInterface.dropTable('experience');
	}
};