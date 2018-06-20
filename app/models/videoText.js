'use strict';
module.exports = (Sequelize, DataTypes) => {
	var VideoText = Sequelize.define('videoText', {
		videoId: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'video_id'
		},
		languageId: {
			primaryKey: true,
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
            field: 'language_id'
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
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
			{ fields: ['video_id'] },
			{ fields: ['language_id'] }
		],
		freezeTableName: true,
		tableName: 'video_i18n'
	});
	VideoText.associate = models => {
		VideoText.belongsTo(models.user, { as: 'author' });
		VideoText.belongsTo(models.video, { as: 'video' });
		VideoText.belongsTo(models.language, { as: 'language' });
	};
	return VideoText;
};