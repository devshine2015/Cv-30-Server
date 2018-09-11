'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('job_types', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
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
			createdAt: 'created_at'
		})
		.then(() =>
			queryInterface.createTable('job_type_i18n', {
				jobTypeId: {
					allowNull: false,
					type: Sequelize.INTEGER,
					primaryKey: true,
					field: 'job_type_id'
				},
				languageId: {
					allowNull: false,
					defaultValue: 1,
					type: Sequelize.INTEGER,
					primaryKey: true,
					field: 'language_id'
				},
				title: {
					type: Sequelize.TEXT,
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
				tableName: 'job_type_i18n'
			})
			.then(() => queryInterface.addIndex('job_type_i18n', { fields: ['job_type_id'] }))
			.then(() => queryInterface.addIndex('job_type_i18n', { fields: ['language_id'] }))
			.then(() => queryInterface.addIndex('job_type_i18n', { unique: true, fields: ['job_type_id', 'language_id'] }))
			.then(() =>
				queryInterface.createTable('job_job_types', {
					jobId: {
						primaryKey: true,
						type: Sequelize.UUID,
						validate: {
							isUUID: 4
						},
						allowNull: false,
						field: 'job_id'
					},
					jobTypeId: {
						primaryKey: true,
						type: Sequelize.INTEGER,
						allowNull: false,
						field: 'job_type_id'
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
					tableName: 'job_job_types'
				})
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.dropTable('job_job_types'),
			queryInterface.dropTable('job_type_i18n'),
			queryInterface.dropTable('job_types')
		];
	}
};