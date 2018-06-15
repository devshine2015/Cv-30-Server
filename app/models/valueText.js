'use strict';
module.exports = (Sequelize, DataTypes) => {
	var ValueText = Sequelize.define('valueText', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		valueId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'value_id'
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
		indexes: [
			{ fields: ['value_id'] },
			{ fields: ['language_id'] },
			{ unique: true, fields: ['value_id', 'language_id'] }
		],
		freezeTableName: true,
		tableName: 'value_i18n'
	});
	ValueText.associate = models => {
		ValueText.belongsTo(models.value, { as: 'value' });
		ValueText.belongsTo(models.language, { as: 'language' });
	};
	return ValueText;
};