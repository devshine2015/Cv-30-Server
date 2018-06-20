'use strict';
module.exports = (sequelize, DataTypes) => {
	var Salary = sequelize.define('salary', {
		userId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'user_id'
		},
		isPublic: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_public'
		},
		currency: {
			allowNull: true,
			defaultValue: 'ron',
			type: DataTypes.ENUM('eur', 'ron'),
			field: 'currency'
		},
		amount: {
			allowNull: true,
			defaultValue: 0,
			type: DataTypes.DOUBLE(14,2),
			field: 'amount'
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
	}, {});
	Salary.associate = models => {
		Salary.belongsTo(models.profile, { as: 'salary', foreignKey: 'user_id' })
	};
	return Salary;
};