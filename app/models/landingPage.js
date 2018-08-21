'use strict';
module.exports = (sequelize, DataTypes) => {
	var LandingPage = sequelize.define('landingPage', {
		id: {
			allowNull: false,
			// autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		hasCover: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_cover'
		},
		coverContentType: {
			allowNull: true,
			type: DataTypes.ENUM('jpeg', 'png', 'gif'),
			field: 'cover_content_type'
		},
		coverPath: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'cover_path'
		},
		coverBackground: {
			allowNull: true,
			defaultValue: '',
			type: DataTypes.TEXT,
			field: 'cover_background'
		},
		hasFooterCover: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'has_footer_cover'
		},
		footerCoverContentType: {
			allowNull: true,
			type: DataTypes.ENUM('jpeg', 'png', 'gif'),
			field: 'footer_cover_content_type'
		},
		footerCoverPath: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'footer_cover_path'
		},
		footerCoverBackground: {
			allowNull: true,
			defaultValue: '',
			type: DataTypes.TEXT,
			field: 'footer_cover_background'
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
		tableName: 'landing_pages'
	});
	LandingPage.associate = models => {
		LandingPage.hasMany(models.landingPageText, { as: 'i18n', foreignKey: 'landing_page_id' });
	};
	return LandingPage;
};