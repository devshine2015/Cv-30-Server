const uuid = require('uuidv4');

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('article_i18n', {
			articleId: {
				allowNull: false,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
				},
				primaryKey: true,
				field: 'article_id'
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
			slug: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true
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
			indexes: [
				{ fields: ['slug'] },
				{ fields: ['article_id'] },
				{ fields: ['language_id'] },
				{ unique: true, fields: ['article_id', 'language_id'] },
				{ unique: true, fields: ['slug', 'language_id'] }
			],
			freezeTableName: true,
			tableName: 'article_i18n'
		})
		.then(() => queryInterface.addIndex('article_i18n', { fields: ['slug'] }))
		.then(() => queryInterface.addIndex('article_i18n', { fields: ['article_id'] }))
		.then(() => queryInterface.addIndex('article_i18n', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('article_i18n', { unique: true, fields: ['slug', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('article_i18n');
	}
};