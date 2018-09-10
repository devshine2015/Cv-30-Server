'use strict';
module.exports = (sequelize, DataTypes) => {
	var ArticleTagText = sequelize.define('articleTagText', {
		tagId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'article_tag_id',
			primaryKey: true
		},
		languageId: {
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
			field: 'language_id',
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false
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
		indexes: [
			{ fields: ['article_tag_id'] },
			{ fields: ['language_id'] },
			{ unique: true, fields: ['article_tag_id', 'language_id'] }
		],
		freezeTableName: true,
		tableName: 'article_tag_i18n'
	});
	ArticleTagText.associate = function(models) {
		ArticleTagText.belongsTo(models.articleTag, { as: 'tag', foreignKey: 'article_tag_id' });
		ArticleTagText.belongsTo(models.language, { as: 'language' });
	};
	return ArticleTagText;
};