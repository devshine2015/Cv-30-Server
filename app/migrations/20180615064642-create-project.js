'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('projects', {
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