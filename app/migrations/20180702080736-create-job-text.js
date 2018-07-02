'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('job_i18n', {
			jobId: {
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'job_id',
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
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			idealCandidate: {
				type: Sequelize.TEXT,
				allowNull: true,
				field: 'ideal_candidate'
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
			tableName: 'job_i18n'
		})
		.then(() => queryInterface.addIndex('job_i18n', { fields: ['job_id'] }))
		.then(() => queryInterface.addIndex('job_i18n', { fields: ['language_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('job_i18n');
	}
};