'use strict';
module.exports = (Sequelize, DataTypes) => {
	var ExperienceText = Sequelize.define('experienceText', {
		experienceId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
                isUUID: 4
            },
			field: 'experience_id',
			primaryKey: true
		},
		languageId: {
			allowNull: false,
			defaultValue: 1,
			type: DataTypes.INTEGER,
			field: 'language_id',
			primaryKey: true
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
			{ fields: ['experience_id'] },
			{ fields: ['language_id'] }
		],
		freezeTableName: true,
		tableName: 'experience_i18n'
	});
	ExperienceText.associate = models => {
		ExperienceText.belongsTo(models.experience, { as: 'experience' });
		ExperienceText.belongsTo(models.language, { as: 'language' });
	};
	return ExperienceText;
};