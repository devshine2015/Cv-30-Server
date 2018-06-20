'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Profile = Sequelize.define('profile', {
		userId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.INTEGER,
			field: 'user_id'
		},
		hasAvatar: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_avatar'
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
	Profile.associate = models => {
		Profile.belongsTo(models.user, { as: 'owner', foreignKey: 'user_id' });
		Profile.hasOne(models.salary, { as: 'salary', foreignKey: 'user_id' });
	};
	return Profile;
};