'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('article_article_tag_users')
			.then(() =>	queryInterface.removeColumn('article_article_tags', 'id'))
			.then(() =>	queryInterface.addConstraint('article_article_tags', ['article_id', 'tag_id'], {
				type: 'primary key',
				name: 'article_tag'
			}))
			.then(() =>	queryInterface.addColumn('article_article_tags', 'votes', {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: true,
				after: 'tag_id'
			}))
			.then(() =>	queryInterface.addColumn('article_article_tags', 'voters', {
				type: Sequelize.TEXT,
				defaultValue: '',
				allowNull: true,
				after: 'votes'
			}));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface
			.removeConstraint('article_article_tags', 'article_tag')
			.then(() =>	queryInterface.createTable('article_article_tag_users', {
				articleArticleTagId: {
					primaryKey: true,
					type: Sequelize.UUID,
					validate: {
						isUUID: 4
					},
					allowNull: false,
					field: 'article_article_tag_id'
				},
				userId: {
					primaryKey: true,
					type: Sequelize.UUID,
					validate: {
						isUUID: 4
					},
					allowNull: false,
					field: 'user_id'
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
				tableName: 'article_article_tag_users'
			}))
			.then(() =>	queryInterface.addColumn('article_article_tags', 'id', {
				primaryKey: true,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				allowNull: false,
				field: 'id'
			}))
			.then(() =>	queryInterface.removeColumn('article_article_tags', 'votes'))
			.then(() =>	queryInterface.removeColumn('article_article_tags', 'voters'));
	}
};
