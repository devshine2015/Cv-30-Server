'use strict';
module.exports = (sequelize, DataTypes) => {
	var ArticleArticleTag = sequelize.define('articleArticleTag', {
		// id: {
		// 	primaryKey: true,
		// 	type: DataTypes.UUID,
		// 	validate: {
		// 		isUUID: 4
		// 	},
		// 	allowNull: false,
		// 	field: 'id'
		// },
		articleId: {
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			allowNull: false,
			field: 'article_id'
		},
		votes:  {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: true
		},
		voters: {
			type: DataTypes.TEXT,
			defaultValue: '',
			allowNull: true
		},
		tagId: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'tag_id'
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'updated_at'
		}
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		tableName: 'article_article_tags',
		// indexes: [
		// 	{ unique: true, fields: ['article_id', 'tag_id'] }
		// ],
	});
	ArticleArticleTag.associate = models => {
		ArticleArticleTag.belongsTo(models.articleTag, { as: 'tag', foreignKey: 'tag_id' });
		ArticleArticleTag.belongsTo(models.article, { as: 'article', foreignKey: 'article_id' });
		// ArticleArticleTag.belongsToMany(models.user, { as: 'users', through: 'article_article_tag_users', foreignKey: 'article_article_tag_id' });
	};
	return ArticleArticleTag;
};