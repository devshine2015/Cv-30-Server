'use strict';
module.exports = (sequelize, DataTypes) => {
	var JobSalary = sequelize.define('jobSalary', {
		jobId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'job_id'
		},
		isPublic: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_public'
		},
		currency: {
			allowNull: true,
			defaultValue: 'ron',
			type: DataTypes.ENUM('eur', 'ron'),
			field: 'currency'
		},
		amountMin: {
			allowNull: true,
			defaultValue: 0,
			type: DataTypes.DOUBLE(14,2),
			field: 'amount_min'
		},
		amountMax: {
			allowNull: true,
			defaultValue: 0,
			type: DataTypes.DOUBLE(14,2),
			field: 'amount_max'
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
		tableName: 'job_salaries'
	});
	JobSalary.associate = models => {
		JobSalary.belongsTo(models.job, { as: 'job', foreignKey: 'job_id' })
	};
	return JobSalary;
};