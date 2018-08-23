'use strict';
module.exports = (sequelize, DataTypes) => {
	var Company = sequelize.define('company', {
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
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'name'
		},
		activityField: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'activity_field'
		},
		industryId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'industry_id'
		},
		noOfEmployees: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'no_of_employees'
		},
		location: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'location'
		},
		hasLogo: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_logo'
		},
		logoContentType: {
			allowNull: true,
			type: DataTypes.ENUM('jpeg', 'png', 'gif'),
			field: 'logo_content_type'
		},
		logoPath: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'logo_path'
		},
		hasCover: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_cover'
		},
		coverContentType: {
			allowNull: true,
			type: DataTypes.ENUM('jpeg', 'png', 'gif'),
			field: 'cover_content_type'
		},
		coverPath: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'cover_path'
		},
		coverBackground: {
			allowNull: true,
			defaultValue: '',
			type: DataTypes.TEXT,
			field: 'cover_background'
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
	});
	Company.associate = models => {
		Company.belongsTo(models.user, { as: 'owner', foreignKey: 'user_id' });
		Company.hasOne(models.place, { as: 'place', foreignKey: 'company_id' });
		Company.hasMany(models.companyText, { as: 'i18n', foreignKey: 'company_id' });
		Company.hasMany(models.job, { as: 'jobs', foreignKey: 'company_id' });
		Company.hasMany(models.article, { as: 'articles', foreignKey: 'posting_company_id' });
		Company.belongsToMany(models.article, { as: 'featuredArticles', through: 'company_featured_articles', foreignKey: 'company_id' });
		Company.belongsToMany(models.article, { as: 'officeArticles', through: 'company_office_articles', foreignKey: 'company_id' });
		Company.belongsToMany(models.article, { as: 'storiesArticles', through: 'company_stories_articles', foreignKey: 'company_id' });
		Company.belongsToMany(models.tag, { as: 'tags', through: 'company_tags', foreignKey: 'company_id' });
		Company.hasMany(models.faq, { as: 'faqs', foreignKey: 'company_id' });
		Company.hasMany(models.team, { as: 'teams', foreignKey: 'company_id' });
		Company.belongsToMany(models.user, { through: 'company_followers', as: 'followers', foreignKey: 'company_id' });
		Company.belongsTo(models.industry, { as: 'industry', foreignKey: 'industry_id' });
	};
	return Company;
};