'use strict';
module.exports = (sequelize, DataTypes) => {
	var CardImages = sequelize.define('cardImage', {
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
		filename: {
			type: DataTypes.TEXT,
			allowNull: false
        },
        name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM('jpeg', 'png'),
			allowNull: false
		},
		width: {
			type: DataTypes.DOUBLE(12, 2),
			allowNull: true,
			defaultValue: 0
		},
		height: {
			type: DataTypes.DOUBLE(12, 2),
			allowNull: true,
			defaultValue: 0
		}
	}, {
		tableName: 'card_images',
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at'
	});
	CardImages.associate = models => CardImages.belongsTo(models.card);
	return CardImages;
};
