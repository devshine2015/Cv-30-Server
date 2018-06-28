'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('companies', {
			id: {
				primaryKey: true,
				type: Sequelize.UUID,
				allowNull: false,
				validate: {
					isUUID: 4
				},
				field: 'id'
			},
			headline: {
				type: Sequelize.TEXT,
				allowNull: true,
				field: 'headline'
			},
			coverVideo: {
				type: Sequelize.TEXT,
				allowNull: true,
				field: 'cover_video_url'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('companies');
	}
};