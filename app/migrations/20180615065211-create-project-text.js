'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('project_i18n', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			projectId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'project_id'
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true
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
			tableName: 'project_i18n'
		})
		.then(() => queryInterface.addIndex('project_i18n', { fields: ['project_id'] }))
		.then(() => queryInterface.addIndex('project_i18n', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('project_i18n', { unique: true, fields: ['project_id', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
    	return queryInterface.dropTable('project_i18n');
	}
};