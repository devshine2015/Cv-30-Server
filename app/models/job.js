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
	};
	return Job;
};