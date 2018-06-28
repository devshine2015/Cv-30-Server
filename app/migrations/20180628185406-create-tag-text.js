'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('tag_i18n', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			tagId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'tag_id'
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			title: {
				type: Sequelize.STRING(100),
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
			tableName: 'tag_i18n'
		})
		.then(() => queryInterface.addIndex('tag_i18n', { fields: ['tag_id'] }))
		.then(() => queryInterface.addIndex('tag_i18n', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('tag_i18n', { unique: true, fields: ['tag_id', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('tag_i18n');
	}
};