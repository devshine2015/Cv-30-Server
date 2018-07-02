'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Image = Sequelize.define('image', {
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
			type: DataTypes.INTEGER,
            field: 'source_id'
		},
		target: {
			allowNull: false,
			type: DataTypes.ENUM('article','profile','profile_cover','company_cover'),
            field: 'target'
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
			{ fields: ['target'] },
			{ fields: ['user_id', 'source_id'] },
			{ fields: ['user_id', 'source_id', 'target'] },
			{ unique: true, fields: ['user_id', 'source_id', 'target', 'is_featured'] }
		]
	});
	Image.associate = models => {
		Image.belongsTo(models.article, { as: 'article', foreignKey: 'source_id' });
		Image.belongsTo(models.user, { as: 'user', foreignKey: 'source_id' });
		Image.belongsTo(models.user, { as: 'author', foreignKey: 'user_id' });
  	};
	return Image;
};