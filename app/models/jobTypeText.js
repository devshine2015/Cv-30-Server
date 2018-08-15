'use strict';
module.exports = (sequelize, DataTypes) => {
	var JobTypeText = sequelize.define('jobTypeText', {
		jobTypeId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'job_type_id',
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
			{ fields: ['job_type_id'] },
			{ fields: ['language_id'] },
			{ unique: true, fields: ['job_type_id', 'language_id'] }
		],
		freezeTableName: true,
		tableName: 'job_type_i18n'
	});
	JobTypeText.associate = function(models) {
		JobTypeText.belongsTo(models.jobType, { as: 'jobType', foreignKey: 'job_type_id' });
		JobTypeText.belongsTo(models.language, { as: 'language' });
	};
	return JobTypeText;
};