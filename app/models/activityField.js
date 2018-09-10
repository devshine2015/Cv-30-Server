'use strict';
module.exports = (sequelize, DataTypes) => {
	const ActivityField = sequelize.define('activityField', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
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
		freezeTableName: true,
		tableName: 'activity_fields'
	});
	ActivityField.associate = models => {
		// ActivityField.hasMany(models.activityFieldText, { as: 'i18n', foreignKey: 'activity_field_id' });
		ActivityField.hasMany(models.job, { as: 'jobs', foreignKey: 'activity_field_id' });
	};
	return ActivityField;
};