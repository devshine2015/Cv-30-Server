'use strict';
module.exports = (sequelize, DataTypes) => {
	var CardContacts = sequelize.define('cardContact', {
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
			type: DataTypes.ENUM('phone', 'email'),
			allowNull: false
		},
        content: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	}, {
		tableName: 'card_contacts',
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	});
	CardContacts.associate = models => CardContacts.belongsTo(models.card);
	return CardContacts;
};
