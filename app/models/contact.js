'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Contact = Sequelize.define('contact', {
		userId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'user_id',
		},
		phone: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'phone_numbers'
		},
		email: {
			allowNull: true,
			type: DataTypes.STRING(255)
		},
		fb: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'facebook'
		},
		linkedin: {
			allowNull: true,
			type: DataTypes.STRING(255)
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
	Contact.associate = function(models) {
		Contact.belongsTo(models.user, { as: 'owner', foreignKey: 'user_id' });
	};
	return Contact;
};