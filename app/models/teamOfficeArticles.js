'use strict';
module.exports = (Sequelize, DataTypes) => {
    var UserValues = Sequelize.define('teamOfficeArticles', {
        team_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            validate: {
                isUUID: 4
            },
            allowNull: false
        },
        article_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            validate: {
                isUUID: 4
            },
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
        tableName: 'team_office_articles'
    });
    UserValues.associate = models => {}
    return UserValues;
};