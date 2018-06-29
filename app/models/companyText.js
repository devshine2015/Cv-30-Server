'use strict';
module.exports = (sequelize, DataTypes) => {
	var companyText = sequelize.define('companyText', {
		companyId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			field: 'company_id',
			primaryKey: true
		},
		languageId: {
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
			field: 'language_id',
			primaryKey: true
		},
		headline: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'headline'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
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
			{ fields: ['company_id'] },
			{ fields: ['language_id'] },
		],
		freezeTableName: true,
		tableName: 'company_i18n'
	});
	companyText.associate = models => {};
	return companyText;
};