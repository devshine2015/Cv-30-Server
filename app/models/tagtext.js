'use strict';
module.exports = (sequelize, DataTypes) => {
	var TagText = sequelize.define('tagText', {
			tagId: {
				allowNull: true,
				type: DataTypes.INTEGER,
				field: 'tag_id'
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: DataTypes.INTEGER,
				field: 'language_id'
			},
			title: {
				type: DataTypes.STRING(100),
				allowNull: false
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
		}
	);
	TagText.associate = function(models) {
		TagText.belongsTo(models.tag, { as: 'tag' });
		TagText.belongsTo(models.language, { as: 'language' });
	};
	return TagText;
};