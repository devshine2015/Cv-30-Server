'use strict';
module.exports = (Sequelize, DataTypes) => {
	const Image = Sequelize.define('image', {
    	id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
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
			type: DataTypes.ENUM('article', 'profile', 'profile_cover', 'company', 'company_cover', 'job', 'team', 'experience', 'project'),
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
		originalFilename: {
			type: DataTypes.STRING(255),
			allowNull: false,
            field: 'original_filename'
		},
		filename: {
			type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isUUID: 4
            },
            field: 'filename'
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
	Image.associate = models => {
		Image.belongsTo(models.article, { as: 'article', foreignKey: 'source_id' });
		Image.belongsTo(models.user, { as: 'user', foreignKey: 'source_id' });
		Image.belongsTo(models.user, { as: 'author', foreignKey: 'user_id' });
		Image.belongsTo(models.ad, {as: 'ad', foreignKey: 'source_id' });
		Image.hasMany(models.imageText, { as: 'i18n', foreignKey: 'image_id' });
  	};
	return Image;
};