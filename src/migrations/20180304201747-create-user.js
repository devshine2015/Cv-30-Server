'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            uid: {
                type: Sequelize.STRING(18),
                allowNull: false,
                validate: {
                    len: { args: [18], msg: "The uid is invalid" }
                }
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: { msg: "Email address appears to be invalid" },
                    max: { args: [255], msg: "Maximum 255 characters are allowed for the email address" }
                }
            },
            salt: {
                type: Sequelize.STRING(60),
                allowNull: false
            },
            hash: {
                type: Sequelize.STRING(60),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('active', 'pending', 'suspended', 'deleted'),
                defaultValue: 'pending',
                allowNull: false
            },
            firstName: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: 'first_name',
                validate: {
                    max: { args: [255], msg: "Maximum 255 characters are allowed for the email address" }
                }
            },
            lastName: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: 'last_name',
                validate: {
                    max: { args: [255], msg: "Maximum 255 characters are allowed for the email address" }
                }
            },
            rememberToken: {
                type: Sequelize.STRING(36),
                allowNull: true,
                validate: {
                    isUUID: 4
                },
                field: 'remember_token'
            },
            passwordResetToken: {
                type: Sequelize.STRING(36),
                allowNull: true,
                validate: {
                    isUUID: 4
                },
                field: 'password_reset_token'
            },
            activationToken: {
                type: Sequelize.STRING(36),
                allowNull: true,
                validate: {
                    isUUID: 4
                },
                field: 'activation_token'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                field: 'created_at',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                field: 'updated_at'
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};