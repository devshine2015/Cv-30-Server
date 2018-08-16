'use strict';
module.exports = (sequelize, DataTypes) => {
	var ActivityFieldText = sequelize.define('activityFieldText', {
		activityFieldId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'activity_field_id',
			primaryKey: true
		},
		languageId: {
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
			field: 'language_id',
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false
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
			{ unique: true, fields: ['activity_field_id', 'language_id'] }
		],
		freezeTableName: true,
		tableName: 'activity_field_i18n'
	});
	ActivityFieldText.associate = function(models) {
		ActivityFieldText.belongsTo(models.activityField, { as: 'activityField', foreignKey: 'activity_field_id' });
		ActivityFieldText.belongsTo(models.language, { as: 'language' });
	};
	return ActivityFieldText;
};