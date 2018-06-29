'use strict';
module.exports = (sequelize, DataTypes) => {
	var Company = sequelize.define('company', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				isUUID: 4
			},
			field: 'id'
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'name',
			unique: true
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		indexes: [
			{  unique: true, fields: ['name'] }
		]
	});
	Company.associate = function(models) {
		Company.belongsToMany(models.tag, { through: 'company_tags', as: 'tags' });
		Company.hasMany(models.companyText, { as: 'i18n', foreignKey: 'company_id' });
		Company.hasMany(models.faq, { as: 'faqs', foreignKey: 'company_id' });
	};
	return Company;
};