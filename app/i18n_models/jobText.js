'use strict';
module.exports = (sequelize, DataTypes) => {
	var JobText = sequelize.define('jobText', {
		jobId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			field: 'job_id',
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
			allowNull: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		idealCandidate: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'ideal_candidate'
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
			{ fields: ['job_id'] },
			{ fields: ['language_id'] },
		],
		freezeTableName: true,
		tableName: 'job_i18n'
	});
	JobText.associate = function(models) {};
	return JobText;
};