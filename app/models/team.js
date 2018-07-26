'use strict';
module.exports = (sequelize, DataTypes) => {
	var Team = sequelize.define('team', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            }
		},
		companyId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
			},
			field: 'company_id'
		},
		name: {
			allowNull: true,
			type: DataTypes.STRING(255)
		},
		hasProfileCover: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_profile_cover'
		},
		coverContentType: {
			allowNull: true,
			type: DataTypes.ENUM('jpeg', 'png', 'gif'),
			field: 'cover_content_type'
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
		createdAt: 'created_at'
	});
	Team.associate = function(models) {
		Team.belongsToMany(models.article, { as: 'officeArticles', through: 'team_office_articles', foreignKey: 'team_id' });
		Team.belongsTo(models.company, { as: 'company', foreignKey: 'company_id' });
		Team.belongsToMany(models.user, { as: 'members', through: 'team_members', foreignKey: 'team_id' });
		Team.hasMany(models.job, { as: 'jobs', foreignKey: 'team_id' });
		Team.belongsToMany(models.user, { as: 'followers', through: 'team_followers', foreignKey: 'team_id' });
	};
	return Team;
};