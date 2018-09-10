'use strict';
module.exports = (sequelize, DataTypes) => {
	var ArticleTag = sequelize.define('articleTag', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: true
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
		tableName: 'article_tags'
	});
	ArticleTag.associate = models => {
		// ArticleTag.hasMany(models.articleTagText, { as: 'i18n', foreignKey: 'article_tag_id' } );
		ArticleTag.hasMany(models.articleArticleTag, { as: 'tags', foreignKey: 'tag_id'});
	};
	return ArticleTag;
};