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
		userId: {
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
			field: 'name',
			unique: true
		},
		activityField: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'activity_field',
			unique: true
		},
		noOfEmployees: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'no_of_employees',
			unique: true
		},
		location: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'location',
			unique: true
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
			{  unique: true, fields: ['name'] }
		]
	});
	Company.associate = models => {
		Company.hasOne(models.place, { as: 'place', foreignKey: 'company_id' });
		Company.hasMany(models.companyText, { as: 'i18n', foreignKey: 'company_id' });
		Company.hasMany(models.job, { as: 'jobs', foreignKey: 'company_id' });
		Company.belongsToMany(models.article, { as: 'featuredArticles', through: 'company_featured_articles', foreignKey: 'company_id' });
		Company.belongsToMany(models.article, { as: 'officeArticles', through: 'company_office_articles', foreignKey: 'company_id' });
		Company.belongsToMany(models.article, { as: 'storiesArticles', through: 'company_stories_articles', foreignKey: 'company_id' });
		Company.belongsToMany(models.tag, { as: 'tags', through: 'company_tags', foreignKey: 'company_id' });
		Company.hasMany(models.faq, { as: 'faqs', foreignKey: 'company_id' });
	};
	return Company;
};