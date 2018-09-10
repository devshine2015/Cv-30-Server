'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Video = Sequelize.define('video', {
		id: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			primaryKey: true
		},
		userId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			field: 'user_id'
		},
		sourceId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			field: 'source_id'
		},
		sourceType: {
			allowNull: false,
			type: DataTypes.ENUM('article', 'profile', 'company', 'job', 'team', 'experience', 'project'),
			field: 'source_type'
		},
		isFeatured: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_featured'
		},
		path: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'path'
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: true
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
				{ fields: ['user_id'] },
				{ fields: ['source_id'] },
				{ fields: ['source_type'] },
				{ fields: ['user_id', 'source_id'] },
				{ fields: ['user_id', 'source_id', 'source_type'] },
				{ unique: true, fields: ['user_id', 'source_id', 'source_type', 'is_featured'] }
			]
		});
	Video.associate = models => {
		Video.belongsTo(models.article, { as: 'article', foreignKey: 'source_id' });
		Video.belongsTo(models.user, { as: 'user', foreignKey: 'source_id' });
		Video.belongsTo(models.user, { as: 'author', foreignKey: 'user_id' });
		// Video.hasMany(models.videoText, { as: 'i18n', foreignKey: 'video_id' });
	};
	return Video;
};