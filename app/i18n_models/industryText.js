'use strict';
module.exports = (sequelize, DataTypes) => {
	var IndustryText = sequelize.define('industryText', {
		industryId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'industry_id',
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
		freezeTableName: true,
		tableName: 'industry_i18n'
	});
	IndustryText.associate = function(models) {
		IndustryText.belongsTo(models.industry, { as: 'industry', foreignKey: 'industry_id' });
	};
	return IndustryText;
};