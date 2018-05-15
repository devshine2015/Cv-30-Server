'use strict';
module.exports = (sequelize, DataTypes) => {
	var CardSetting = sequelize.define('cardSetting', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		card_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			unique: true
		},
		visible: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		shareable: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		}
	}, {
		tableName: 'card_settings',
		timestamps: true
	});
	CardSetting.associate = models => CardSetting.belongsTo(models.card);
	return CardSetting;
};
