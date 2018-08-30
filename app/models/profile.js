'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Profile = Sequelize.define('profile', {
		userId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'user_id'
		},
		hasAvatar: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_avatar'
		},
		avatarContentType: {
			allowNull: true,
			type: DataTypes.ENUM('jpeg', 'png', 'gif'),
			field: 'avatar_content_type'
		},
		avatarPath: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'avatar_path'
		},
		hasProfileCover: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_profile_cover'
		},
		profileCoverContentType: {
			allowNull: true,
			type: DataTypes.ENUM('jpeg', 'png', 'gif'),
			field: 'profile_cover_content_type'
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
		position: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'position'
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
	Profile.associate = models => {
		Profile.belongsTo(models.user, { as: 'owner', foreignKey: 'user_id' });
		Profile.hasOne(models.salary, { as: 'salary', foreignKey: 'user_id' });
	};
	return Profile;
};