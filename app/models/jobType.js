'use strict';
module.exports = (sequelize, DataTypes) => {
	const JobType = sequelize.define('jobType', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
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
		tableName: 'job_types'
    });
    JobType.associate = models => {
		JobType.hasMany(models.jobTypeText, { as: 'i18n', foreignKey: 'job_type_id' } );
		JobType.belongsToMany(models.job, { as: 'jobs', through: 'job_job_types', foreignKey: 'job_type_id' });
    };
    return JobType;
};