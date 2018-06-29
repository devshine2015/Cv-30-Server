'use strict';
module.exports = (sequelize, DataTypes) => {
	var faqText = sequelize.define('faqText', {
		faqId: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'faq_id'
		},
		languageId: {
			primaryKey: true,
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
			field: 'language_id'
		},
		question: {
			allowNull: false,
			type: DataTypes.TEXT,
			field: 'question'
		},
		answer: {
			allowNull: false,
			type: DataTypes.TEXT,
			field: 'answer'
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
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