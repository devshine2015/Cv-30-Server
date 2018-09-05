'use strict';
module.exports = (sequelize, DataTypes) => {
	const JobBenefit = sequelize.define('jobBenefit', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		key: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		icon: {
			type: DataTypes.TEXT,
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
		tableName: 'job_benefits'
	});
	JobBenefit.associate = models => {
		JobBenefit.belongsToMany(models.job, { as: 'jobs', through: 'job_job_benefits', foreignKey: 'job_benefit_id' });
	};
	return JobBenefit;
};