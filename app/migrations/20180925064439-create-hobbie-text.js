'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('hobby_i18n', {
			hobbyId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
				},
				field: 'hobby_id'
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
			tableName: 'hobby_i18n'
		})
		.then(() => queryInterface.addIndex('hobby_i18n', { fields: ['hobby_id'] }))
		.then(() => queryInterface.addIndex('hobby_i18n', { fields: ['language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('hobby_i18n');
	}
};