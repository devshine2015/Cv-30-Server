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
		expireDate: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'expire_date'
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
		createdAt: 'created_at'
	});
	Job.associate = function(models) {
		Job.hasMany(models.jobText, { as: 'i18n', foreignKey: 'job_id' });
		Job.belongsTo(models.company, { as: 'company', foreignKey: 'company_id' });
	};
	return Job;
};