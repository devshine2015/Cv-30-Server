'use strict';
module.exports = (Sequelize, DataTypes) => {
    var Skill = Sequelize.define('skill', {
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
    Skill.associate = models => {
		Skill.belongsToMany(models.user, { through: Sequelize.define('UserSkills', {})});
		Skill.belongsToMany(models.job, { as: 'jobs', through: 'job_skills', foreignKey: 'skill_id' });
		Skill.hasMany(models.skillText, { as: 'i18n', foreignKey: 'skill_id' } );
    };
    return Skill;
};