'use strict';
module.exports = (sequelize, DataTypes) => {
	var Language = sequelize.define('language', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		code: {
			allowNull: false,
			type: DataTypes.STRING(10)
		},
		label: {
			allowNull: false,
			type: DataTypes.STRING(50)
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
			{ unique: true, fields: ['code'] }
		]
    });
	Language.associate = models => {};
	return Language;
};