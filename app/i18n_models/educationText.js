'use strict';
module.exports = (Sequelize, DataTypes) => {
	var educationText = Sequelize.define('educationText', {
		educationId: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'education_id'
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
			{ fields: ['education_id'] },
			{ fields: ['language_id'] }
		],
		freezeTableName: true,
		tableName: 'education_i18n'
	});
	educationText.associate = function(models) {
		educationText.belongsTo(models.education, { as: 'education' });
		educationText.belongsTo(models.language, { as: 'language' });
	};
	return educationText;
};