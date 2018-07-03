'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('faq_i18n', {
			faqId: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'faq_id'
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
			tableName: 'faq_i18n'
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('faq_i18n');
	}
};