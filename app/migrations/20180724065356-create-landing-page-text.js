'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('landing_page_i18n', {
            landingPageId: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                field: "landing_page_id"
            },
            languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id',
				primaryKey: true
			},
			headline: {
				type: Sequelize.STRING(255),
				allowNull: true,
				field: 'headline'
			},
            createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'created_at'
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at'
            }
        }, {
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at',
			freezeTableName: true,
			tableName: 'landing_page_i18n'
        })
        .then(() => queryInterface.addIndex('landing_page_i18n', { fields: ['landing_page_id'] }))
		.then(() => queryInterface.addIndex('landing_page_i18n', { fields: ['language_id'] }));
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('landing_page_i18n');
    }
};