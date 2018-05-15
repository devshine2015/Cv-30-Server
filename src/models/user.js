'use strict';
module.exports = (Sequelize, DataTypes) => {
    var User = Sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uid: {
            type: DataTypes.STRING(18),
            allowNull: false,
            validate: {
                len: [14, 18]
            }
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        hash: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'suspended', 'deleted'),
            defaultValue: 'pending',
            allowNull: false
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
        rememberToken: {
            type: DataTypes.STRING(36),
            allowNull: true,
            validate: {
                isUUID: 4
            },
            field: 'remember_token'
        },
        passwordResetToken: {
            type: DataTypes.STRING(36),
            allowNull: true,
            validate: {
                isUUID: 4
            },
            field: 'password_reset_token'
        },
        activationToken: {
            type: DataTypes.STRING(36),
            allowNull: true,
            validate: {
                isUUID: 4
            },
            field: 'activation_token'
        }
    }, { 
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    });
    User.associate = models => {
        User.belongsToMany(models.role, {
            through: Sequelize.define('UserRoles', {})
        })
        User.hasMany(models.card);
    }
    return User;
};
