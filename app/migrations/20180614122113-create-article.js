'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('articles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			uid: {
				type: Sequelize.STRING(36),
				allowNull: false,
				validate: {
					isUUID: 4
				},
				field: 'uid'
			},
			author: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'user_id'
			},
			is_featured: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_featured'
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
		.then(() => queryInterface.addIndex('articles', { unique: true, fields: ['uid'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('articles');
	}
};