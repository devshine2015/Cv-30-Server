'use strict';
module.exports = (sequelize, DataTypes) => {
	const Ad = sequelize.define('ad', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				isUUID: 4
			}
		},
		url: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'url'
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
		freezeTableName: true,
		tableName: 'ads'
	});
	Ad.associate = models => {
		Ad.hasOne(models.image, { as: 'image', foreignKey: 'source_id' });
	};
	return Ad;
};