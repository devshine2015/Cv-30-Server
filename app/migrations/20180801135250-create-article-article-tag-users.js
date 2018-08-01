'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('article_article_tag_users', {
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
		});
		
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('article_article_tag_users');
	}
};
