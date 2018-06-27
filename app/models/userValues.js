'use strict';
module.exports = (Sequelize, DataTypes) => {
    var UserValues = Sequelize.define('userValues', {
    }, {
        tableName: 'user_values'
    });

    return UserValues;
};