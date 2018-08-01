'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('article_article_tags', {
			id: {
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				allowNull: false,
				field: 'id'
			},
			articleId: {
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				allowNull: false,
				field: 'article_id'
			},
			tagId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'tag_id'
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
			tableName: 'article_article_tags'
		})
		.then(() => queryInterface.addIndex('article_article_tags', { unique: true, fields: ['article_id', 'tag_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('article_article_tags');
	}
};