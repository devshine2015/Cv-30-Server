'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('article_tag_i18n', {
			tagId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				field: 'article_tag_id',
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				primaryKey: true,
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
			tableName: 'article_tag_i18n'
		})
		.then(() => queryInterface.addIndex('article_tag_i18n', { fields: ['article_tag_id'] }))
		.then(() => queryInterface.addIndex('article_tag_i18n', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('article_tag_i18n', { unique: true, fields: ['article_tag_id', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('article_tag_i18n');
	}
};