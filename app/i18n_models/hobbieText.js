'use strict';
module.exports = (Sequelize, DataTypes) => {
	var hobbieText = Sequelize.define('hobbieText', {
		hobbieId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'hobbie_id'
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
			{ fields: ['hobbie_id'] },
			{ fields: ['language_id'] }
		],
		freezeTableName: true,
		tableName: 'hobbie_i18n'
	});
	hobbieText.associate = function(models) {
		hobbieText.belongsTo(models.hobbie, { as: 'hobbie' });
		hobbieText.belongsTo(models.language, { as: 'language' });
	};
	return hobbieText;
};