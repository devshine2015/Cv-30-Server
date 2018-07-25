'use strict';
module.exports = (sequelize, DataTypes) => {
	var LandingPageText = sequelize.define('landingPageText', {
    	landingPageId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.INTEGER,
			field: "landing_page_id"
		},
		languageId: {
			primaryKey: true,
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
            field: 'language_id'
		},
		headline: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		footerMessage: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'footer_message'
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
		indexes: [
			{ fields: ['landing_page_id'] },
			{ fields: ['language_id'] },
		],
		freezeTableName: true,
		tableName: 'landing_page_i18n'
	});
	LandingPageText.associate = models => {
		LandingPageText.belongsTo(models.landingPage, { as: 'landingPage' });
		LandingPageText.belongsTo(models.language, { as: 'language' });
	};
	return LandingPageText;
};