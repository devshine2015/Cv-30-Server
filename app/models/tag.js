'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Tag = Sequelize.define('tag', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
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
		createdAt: 'created_at'
	});
	Tag.associate = models => {
		Tag.belongsToMany(models.company, {
			through: 'company_tags'
		});
		Tag.hasMany(models.tagText, { as: 'i18n', foreignKey: 'tag_id' } );
	};
	return Tag;
};