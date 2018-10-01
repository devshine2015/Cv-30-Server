'use strict';
module.exports = (sequelize, DataTypes) => {
	const Industry = sequelize.define('industry', {
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
		tableName: 'industries'
	});
	Industry.associate = models => {
		// Industry.hasMany(models.industryText, { as: 'i18n', foreignKey: 'industry_id' });
		Industry.hasMany(models.company, { as: 'jobs', foreignKey: 'industry_id' });
	};
	return Industry;
};