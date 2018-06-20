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
		languageId: {
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
            field: 'language_id'
		},
		title: {
			type: DataTypes.STRING(255),
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
			{ fields: ['language_id'] },
			{ unique: true, fields: ['user_id', 'language_id'] }
		]
	});
	Story.associate = models => {
		Story.belongsTo(models.user, { as: 'owner' });
		Story.belongsTo(models.language, { as: 'language' });
	};
	return Story;
};