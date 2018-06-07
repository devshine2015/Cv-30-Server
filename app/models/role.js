'use strict';
module.exports = (Sequelize, DataTypes) => {
  	var Role = Sequelize.define('role', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true
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
            {
            unique: true,
            fields: ['name']
            }
        ]
	});
	Role.associate = models => 
		Role.belongsToMany(models.user, {
			through: Sequelize.define('UserRoles', {})
		});
	return Role;
};
