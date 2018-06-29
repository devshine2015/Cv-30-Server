'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('story_i18n', {
			userId: {
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'user_id',
				primaryKey: true
			},
			languageId: {
				primaryKey: true,
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			title: {
				allowNull: false,
				type: Sequelize.TEXT,
				field: 'title'
			},
			description: {
				allowNull: false,
				type: Sequelize.TEXT,
				field: 'description'
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