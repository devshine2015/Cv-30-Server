'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('value_i18n', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			valueId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'value_id'
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			title: {
				type: Sequelize.STRING(255),
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
		}, {
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at',
			freezeTableName: true,
			tableName: 'value_i18n'
		})
		.then(() => queryInterface.addIndex('value_i18n', { fields: ['value_id'] }))
		.then(() => queryInterface.addIndex('value_i18n', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('value_i18n', { unique: true, fields: ['value_id', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('value_i18n');
	}
};