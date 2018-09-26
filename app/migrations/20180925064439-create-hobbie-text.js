'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('hobbie_i18n', {
			hobbieId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
				},
				field: 'hobbie_id'
			},
			languageId: {
				primaryKey: true,
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			title: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true
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
			tableName: 'hobbie_i18n'
		})
		.then(() => queryInterface.addIndex('hobbie_i18n', { fields: ['hobbie_id'] }))
		.then(() => queryInterface.addIndex('hobbie_i18n', { fields: ['language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('hobbie_i18n');
	}
};