'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('story_i18n', {
			userId: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'user_id'
			},
			languageId: {
				primaryKey: true,
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			question: {
				allowNull: false,
				type: Sequelize.TEXT,
				field: 'question'
			},
			answer: {
				allowNull: false,
				type: Sequelize.TEXT,
				field: 'answer'
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
			freezeTableName: true,
			tableName: 'story_i18n'
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('story_i18n');
	}
};