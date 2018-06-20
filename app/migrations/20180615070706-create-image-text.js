'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('image_i18n', {
			imageId: {
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'image_id',
				primaryKey: true
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id',
				primaryKey: true
			},
			title: {
				type: Sequelize.TEXT,
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
			tableName: 'image_i18n'
		})
		.then(() => queryInterface.addIndex('image_i18n', { fields: ['image_id'] }))
		.then(() => queryInterface.addIndex('image_i18n', { fields: ['language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('image_i18n');
	}
};