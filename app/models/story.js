'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Story = Sequelize.define('story', {
		userId: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.UUID,
				validate: {
					isUUID: 4
				},
			field: 'user_id'
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
		indexes: []
	});
	Story.associate = models => {
		Story.belongsTo(models.user, { as: 'owner' });
		Story.hasMany(models.storyText, { as: 'i18n' })
		Story.belongsTo(models.language, { as: 'language' });
	};
	return Story;
};