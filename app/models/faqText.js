'use strict';
module.exports = (sequelize, DataTypes) => {
	var faqText = sequelize.define('faqText', {
		faqId: {
			primaryKey: true,
			allowNull: false,
			type: Sequelize.INTEGER,
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
	faqText.associate = models => {};
	return faqText;
};