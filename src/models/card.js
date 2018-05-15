'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Card = Sequelize.define('card', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	});
	Card.associate = (models) => {
		Card.belongsTo(models.user);
		Card.hasOne(models.cardSetting, { as: 'settings', foreignKey: 'card_id' });
		Card.hasOne(models.cardStat, { as: 'stats', foreignKey: 'card_id' });
		Card.hasMany(models.cardText, { as: 'texts' });
		Card.hasMany(models.cardImage, { as: 'images' });
		Card.hasMany(models.cardContact, { as: 'contacts' });
		Card.hasMany(models.cardSocial, { as: 'social' });
	};
	return Card;
};