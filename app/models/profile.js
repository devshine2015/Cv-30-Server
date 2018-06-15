'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Profile = Sequelize.define('profile', {
		userId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.INTEGER,
			field: 'user_id'
		},
		isSalaryPublic: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_salary_public'
		},
		desiredSalary: {
			allowNull: true,
			defaultValue: 0,
			type: DataTypes.DOUBLE(14,2),
			field: 'desired_salary'
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
	Profile.associate = models => {
		Profile.belongsTo(models.user, { as: 'owner' });
	};
	return Profile;
};