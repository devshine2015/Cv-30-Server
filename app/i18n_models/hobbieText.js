'use strict';
module.exports = (Sequelize, DataTypes) => {
	var hobbyText = Sequelize.define('hobbyText', {
		hobbyId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'hobby_id'
		},
		languageId: {
			primaryKey: true,
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
            field: 'language_id'
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
			{ fields: ['hobby_id'] },
			{ fields: ['language_id'] }
		],
		freezeTableName: true,
		tableName: 'hobby_i18n'
	});
	hobbyText.associate = function(models) {
		hobbyText.belongsTo(models.hobby, { as: 'hobby' });
		hobbyText.belongsTo(models.language, { as: 'language' });
	};
	return hobbyText;
};