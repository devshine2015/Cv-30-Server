'use strict';
module.exports = (sequelize, DataTypes) => {
	var CardTexts = sequelize.define('cardText', {
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
			type: DataTypes.ENUM('front', 'back'),
            allowNull: false,
            defaultContent: 'en'
        },
        language: {
			type: DataTypes.ENUM('en'),
            allowNull: false,
            defaultContent: 'en'
		},
        content: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		tableName: 'card_texts',
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at'
	});
	CardTexts.associate = models => CardTexts.belongsTo(models.card);
	return CardTexts;
};
