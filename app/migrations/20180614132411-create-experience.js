'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('experience', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'user_id'
			},
			locationId: {
				allowNull: false,
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