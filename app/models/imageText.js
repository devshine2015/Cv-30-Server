'use strict';
module.exports = (Sequelize, DataTypes) => {
	var ImageText = Sequelize.define('imageText', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		imageId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'image_id'
		},
		languageId: {
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
            field: 'language_id'
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
			{ fields: ['image_id'] },
			{ fields: ['language_id'] },
			{ unique: true, fields: ['image_id', 'language_id'] }
		],
		freezeTableName: true,
		tableName: 'image_i18n'
	});
	ImageText.associate = models => {
		ImageText.belongsTo(models.image, { as: 'image' });
		ImageText.belongsTo(models.language, { as: 'language' });
	}
	return ImageText;
};