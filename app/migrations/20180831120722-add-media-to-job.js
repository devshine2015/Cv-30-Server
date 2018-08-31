'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'jobs',
				'imagePath',
				{
					type: Sequelize.TEXT,
					allowNull: true,
					after: 'activity_field_id',
					field: 'image_path'
				}
			),
			queryInterface.addColumn(
				'jobs',
				'videoUrl',
				{
					type: Sequelize.TEXT,
					allowNull: true,
					after: 'imagePath',
					field: 'video_url'
				}
			)
		]
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('jobs', 'image_path'),
			queryInterface.removeColumn('jobs', 'video_url')
		];
	}
};
