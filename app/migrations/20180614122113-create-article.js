const uuid = require('uuidv4');

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('articles', {
			id: {
				allowNull: false,
				primaryKey: true,
				defaultValue: uuid(),
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
			},
			author: {
				allowNull: false,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				field: 'user_id'
			},
			isFeatured: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_featured'
			},
			isAboutMe: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_about_me'
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
		})
		.then(() => queryInterface.addIndex('articles', ['user_id']))
		.then(() => queryInterface.addIndex('articles', ['user_id', 'is_featured']))
		.then(() => queryInterface.addIndex('articles', ['user_id', 'is_about_me']));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('articles');
	}
};