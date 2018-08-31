'use strict';
module.exports = (sequelize, DataTypes) => {
	var Job = sequelize.define('job', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				isUUID: 4
			},
			field: 'id'
		},
		companyId: {
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				isUUID: 4
			},
			field: 'company_id'
		},
		teamId: {
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				isUUID: 4
			},
			field: 'team_id'
		},
		expireDate: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'expire_date'
		},
		phone: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'phone'
		},
		email: {
			allowNull: true,
			type: DataTypes.STRING(255)
		},
		facebook: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'facebook'
		},
		linkedin: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'linkedin'
		},
		location: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'location'
		},
		activityFieldId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'activity_field_id'
		},
		imagePath: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'image_path'
		},
		videoUrl: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'video_url'
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
			{  fields: ['company_id'] },
			{  fields: ['team_id'] },
			{  fields: ['team_id', 'company_id'] }
		]
	});
	Job.associate = function(models) {
		Job.hasMany(models.jobText, { as: 'i18n', foreignKey: 'job_id' });
		Job.belongsTo(models.company, { as: 'company', foreignKey: 'company_id' });
		Job.belongsTo(models.team, { as: 'team', foreignKey: 'team_id' });
		Job.belongsToMany(models.user, { through: 'job_followers', as: 'followers', foreignKey: 'job_id' });
		Job.belongsToMany(models.user, { through: 'job_applicants', as: 'applicants', foreignKey: 'job_id' });
		Job.belongsToMany(models.jobType, { through: 'job_job_types', as: 'jobTypes', foreignKey: 'job_id' });
		Job.hasOne(models.jobSalary, { as: 'salary', foreignKey: 'job_id' });
		Job.belongsTo(models.activityField, { as: "activityField", foreignKey: 'activity_field_id' });
		Job.belongsToMany(models.skill, { as: 'skills', through: 'job_skills', foreignKey: 'job_id' });
	};
	return Job;
};