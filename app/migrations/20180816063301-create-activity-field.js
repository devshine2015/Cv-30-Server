'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.createTable('activity_fields', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
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
			}),

			queryInterface.createTable('activity_field_i18n', {
				activityFieldId: {
					allowNull: false,
					type: Sequelize.INTEGER,
					primaryKey: true,
					field: 'activity_field_id'
				},
				languageId: {
					allowNull: false,
					defaultValue: 1,
					type: Sequelize.INTEGER,
					primaryKey: true,
					field: 'language_id'
				},
				title: {
					type: Sequelize.TEXT,
					allowNull: false
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
			})
			.then(() => queryInterface.addIndex('activity_field_i18n', { unique: true, fields: ['activity_field_id', 'language_id'] })),

			queryInterface.addColumn(
				'jobs',
				'activity_field_id',
				{
					allowNull: true,
					type: Sequelize.INTEGER,
					after: 'location'
				}
			),
		]
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('jobs', 'activity_field_id'),
			queryInterface.dropTable('activity_field_i18n'),
			queryInterface.dropTable('activity_fields')
		]
	}
};