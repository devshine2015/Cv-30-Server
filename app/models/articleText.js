'use strict';
module.exports = (Sequelize, DataTypes) => {
	var ArticleText = Sequelize.define('articleText', {
    	id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
    	articleId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'article_id'
		},
		languageId: {
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
            field: 'language_id'
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		slug: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		},
		description: {
			type: DataTypes.TEXT,
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
		indexes: [
			{ fields: ['slug'] },
			{ fields: ['article_id'] },
			{ fields: ['language_id'] },
			{ unique: true, fields: ['article_id', 'language_id'] },
			{ unique: true, fields: ['slug', 'language_id'] }
		],
		freezeTableName: true,
		tableName: 'article_i18n'
	});
	ArticleText.associate = models => {
		ArticleText.belongsTo(models.article, { as: 'article' });
		ArticleText.belongsTo(models.language, { as: 'language' });
	};
	return ArticleText;
};