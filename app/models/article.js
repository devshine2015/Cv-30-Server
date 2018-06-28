'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Article = Sequelize.define('article', {
    	id: {
			primaryKey: true,
			type: DataTypes.UUID,
            allowNull: false,
            validate: {
                isUUID: 4
            },
            field: 'id'
		},
		userId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
            field: 'user_id'
		},
		is_featured: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_featured'
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
			{ fields: ['user_id'] },
			{ fields: ['user_id', 'is_featured'] }
		]
	});
	Article.associate = models => {
		Article.belongsTo(models.user, { as: 'author', foreignKey: 'user_id' });
		Article.hasMany(models.articleText, { as: 'texts' });
		Article.hasMany(models.image, { as: 'images' });
		Article.belongsToMany(models.company, { as: 'featured', through: 'company_featured_articles', foreignKey: 'article_id' }),
		Article.belongsToMany(models.company, { as: 'lifeAtTheOffice', through: 'company_office_articles', foreignKey: 'article_id' }),
		Article.belongsToMany(models.company, { as: 'moreStories', through: 'company_stories_articles', foreignKey: 'article_id' })
	};
	return Article;
};