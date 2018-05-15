'use strict';
module.exports = (sequelize, DataTypes) => {
	var CardSocial = sequelize.define('cardSocial', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		card_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
        type: {
			type: DataTypes.ENUM('url', 'facebook', 'twitter', 'instagram'),
			allowNull: false
		},
        content: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	}, {
		tableName: 'card_social',
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at'
	});
	CardSocial.associate = models => CardSocial.belongsTo(models.card);
	return CardSocial;
};
