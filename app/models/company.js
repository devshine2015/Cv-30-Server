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
		headline: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'headline'
		},
		coverVideo: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'cover_video_url'
		}
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at'
	});
	Company.associate = function(models) {
		Company.belongsToMany(models.tag, { through: 'company_tags', as: 'tags' });
		Company.hasMany(models.faq, { as: 'faqs', foreignKey: 'company_id' });
	};
	return Company;
};