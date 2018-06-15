'use strict';
module.exports = (Sequelize, DataTypes) => {
	var ExperienceText = Sequelize.define('experienceText', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		experienceId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'experience_id'
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
			{ fields: ['experience_id'] },
			{ fields: ['language_id'] },
			{ unique: true, fields: ['experience_id', 'language_id'] }
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