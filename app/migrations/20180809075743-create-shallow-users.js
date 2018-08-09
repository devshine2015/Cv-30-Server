const uuid = require('uuidv4');

'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('shallow_users', {
			id: {
                type: Sequelize.UUID,
                defaultValue: uuid(),
                validate: {
                    isUUID: 4
                },
                allowNull: false,
                primaryKey: true
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
			position: {
				type: Sequelize.STRING(255),
				allowNull: false,
				fieldName: 'position'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'created_at'
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at'
			}
		}, {
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('shallow_users');
	}
};