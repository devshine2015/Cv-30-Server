'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return[
			queryInterface.createTable('industries', {
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
			}),

			queryInterface.createTable('industry_i18n', {
				industryId: {
					allowNull: false,
					type: Sequelize.INTEGER,
					primaryKey: true,
					field: 'industry_id'
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
			}),

			queryInterface.addColumn(
				'companies',
				'industry_id',
				{
					allowNull: true,
					type: Sequelize.INTEGER,
					after: 'activity_field'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('companies', 'industry_id'),
			queryInterface.dropTable('industries')
		];
	}
};