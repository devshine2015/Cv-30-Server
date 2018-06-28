'use strict';
module.exports = (Sequelize, DataTypes) => {
    var UserSkills = Sequelize.define('userSkills', {
    }, {
        tableName: 'user_skills'
    });
    UserSkills.associate = models => {}
    return UserSkills;
};