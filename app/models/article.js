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
		ownerId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			field: 'user_id'
		},
		isFeatured: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_featured'
		},
		isAboutMe: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_about_me'
		},
		isPost: {
			allowNull: false,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_post'
		},
		postAs: {
			allowNull: false,
			defaultValue: 'profile',
			type: DataTypes.ENUM('profile', 'team', 'company'),
			field: 'post_as'
		},
		postingCompanyId: {
			type: DataTypes.UUID,
			allowNull: true,
			validate: {
				isUUID: 4
			},
			field: 'posting_company_id'
		},
		postingTeamId: {
			type: DataTypes.UUID,
			allowNull: true,
			validate: {
				isUUID: 4
			},
			field: 'posting_team_id'
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
				{ fields: ['user_id', 'is_featured'] },
				{ fields: ['user_id', 'is_about_me'] }
			]
		});
	Article.associate = models => {
		Article.belongsTo(models.user, { as: 'author', foreignKey: 'user_id' });
		Article.hasMany(models.articleText, { as: 'i18n' });
		Article.hasMany(models.image, { as: 'images', foreignKey: 'source_id' });
		Article.hasMany(models.video, { as: 'videos', foreignKey: 'source_id' });
		Article.hasOne(models.image, { as: 'featuredImage', foreignKey: 'source_id', scope: { is_featured: true } })
		Article.belongsToMany(models.company, { as: 'featured', through: 'company_featured_articles', foreignKey: 'article_id' }),
		Article.belongsToMany(models.company, { as: 'lifeAtTheOffice', through: 'company_office_articles', foreignKey: 'article_id' }),
		Article.belongsToMany(models.company, { as: 'moreStories', through: 'company_stories_articles', foreignKey: 'article_id' })
		Article.belongsToMany(models.team, { as: 'officeArticles', through: 'team_office_articles', foreignKey: 'article_id' });
		Article.hasMany(models.articleArticleTag, { as: 'tags', foreignKey: 'article_id'});
		Article.belongsTo(models.company, { as: 'postingCompany', foreignKey: 'posting_company_id' });
		Article.belongsTo(models.team, { as: 'postingTeam', foreignKey: 'posting_team_id' });
	};
	return Article;
};