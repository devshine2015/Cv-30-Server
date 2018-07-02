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
		coverBackground: {
			allowNull: true,
			defaultValue: '',
			type: DataTypes.STRING(100),
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
	};
	return Team;
};