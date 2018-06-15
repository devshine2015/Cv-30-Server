'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('skill_i18n', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			skillId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'skill_id'
			},
			languageId: {
				allowNull: false,
				defaultValue: 1,
				type: Sequelize.INTEGER,
				field: 'language_id'
			},
			title: {
				type: Sequelize.STRING(100),
				allowNull: false
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
			tableName: 'skill_i18n'
		})
		.then(() => queryInterface.addIndex('skill_i18n', { fields: ['skill_id'] }))
		.then(() => queryInterface.addIndex('skill_i18n', { fields: ['language_id'] }))
		.then(() => queryInterface.addIndex('skill_i18n', { unique: true, fields: ['skill_id', 'language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('skill_i18n');
	}
};