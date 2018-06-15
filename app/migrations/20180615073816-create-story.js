'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('stories', {
			userId: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'user_id'
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			title: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true
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
			createdAt: 'created_at',
		})
		.then(() => queryInterface.addIndex('stories', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('stories', { unique: true, fields: ['user_id', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('stories');
	}
};