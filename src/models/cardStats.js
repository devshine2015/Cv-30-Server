'use strict';
module.exports = (sequelize, DataTypes) => {
	var CardStats = sequelize.define('cardStat', {
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
        views: {
			type: DataTypes.INTEGER,
            allowNull: false,
            defaultContent: 0
        },
        shares: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultContent: 0
        }
	}, {
		tableName: 'card_stats',
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at'
	});
	CardStats.associate = models => CardStats.belongsTo(models.card);
	return CardStats;
};
