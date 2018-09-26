'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.createTable('ads', {
				id: {
					allowNull: false,
					type: Sequelize.UUID,
					validate: {
						isUUID: 4
					},
					primaryKey: true
				},
				url: {
					allowNull: true,
					type: Sequelize.TEXT
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

			queryInterface.changeColumn('images', 'source_type', {
				type: Sequelize.ENUM('article', 'profile', 'profile_cover', 'company', 'company_cover', 'job', 'team', 'experience', 'project','education', 'hobbie', 'ad')
			})
		]
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.dropTable('ads'),
			queryInterface.changeColumn('images', 'source_type', {
				type: Sequelize.ENUM('article', 'profile', 'profile_cover', 'company', 'company_cover', 'job', 'team', 'experience', 'project', 'education', 'hobbie')
			})
		]
	}
};