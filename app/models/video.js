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
			type: DataTypes.ENUM('article','profile','company', 'job', 'team'),
            field: 'source_type'
		},
		target: {
			allowNull: false,
			type: DataTypes.ENUM('article','profile_cover','company_cover'),
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
	Video.associate = models => {
		Video.belongsTo(models.article, { as: 'article', foreignKey: 'source_id' });
		Video.belongsTo(models.user, { as: 'user', foreignKey: 'source_id' });
		Video.belongsTo(models.user, { as: 'author' });
	};
	return Video;
};