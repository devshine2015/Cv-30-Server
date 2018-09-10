'use strict';
module.exports = (Sequelize, DataTypes) => {
  	var SkillText = Sequelize.define('skillText', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		skillId: {
			allowNull: true,
			type: DataTypes.INTEGER,
			field: 'skill_id'
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
			{ fields: ['skill_id'] },
			{ fields: ['language_id'] },
			{ unique: true, fields: ['skill_id', 'language_id'] }
		],
		freezeTableName: true,
		tableName: 'skill_i18n'
	});
	SkillText.associate = models => {
		SkillText.belongsTo(models.skill, { as: 'skill' });
		SkillText.belongsTo(models.language, { as: 'language' });
	};
	return SkillText;
};