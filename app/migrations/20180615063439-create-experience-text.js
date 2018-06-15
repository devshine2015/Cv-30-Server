'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('experience_i18n', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			experienceId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'experience_id'
			},
			languageId: {
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
			tableName: 'experience_i18n'
		})
		.then(() => queryInterface.addIndex('experience_i18n', { fields: ['experience_id'] }))
		.then(() => queryInterface.addIndex('experience_i18n', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('experience_i18n', { fields: ['experience_id', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('experience_i18n');
	}
};