'use strict';
module.exports = (sequelize, DataTypes) => {
	var storyText = sequelize.define('storyText', {
		userId: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'user_id'
		},
		languageId: {
			primaryKey: true,
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
			field: 'language_id'
		},
		title: {
			allowNull: false,
			type: DataTypes.TEXT,
			field: 'title'
		},
		description: {
			allowNull: false,
			type: DataTypes.TEXT,
			field: 'description'
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
		tableName: 'user_i18n'
	});
	storyText.associate = models => {};
	return storyText;
};