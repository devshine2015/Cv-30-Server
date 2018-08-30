'use strict';
module.exports = (Sequelize, DataTypes) => {
    var ShallowUser = Sequelize.define('shallowUser', {
        id: {
            type: DataTypes.UUID,
            validate: {
                isUUID: 4
            },
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'last_name'
        },
        position: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'position'
        },
        avatarPath: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'avatar_path'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description'
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
        tableName: 'shallow_users'
    });
    ShallowUser.associate = models => {
        ShallowUser.belongsToMany(models.team, { through: 'team_shallow_members', as: 'teams', foreignKey: 'shallow_user_id' });
    }
    return ShallowUser;
};