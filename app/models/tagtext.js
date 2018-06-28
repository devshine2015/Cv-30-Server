'use strict';
module.exports = (sequelize, DataTypes) => {
	var TagText = sequelize.define('tagText', {
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
		TagText.belongsTo(models.tag, { as: 'value' });
		TagText.belongsTo(models.language, { as: 'language' });
	};
	return TagText;
};