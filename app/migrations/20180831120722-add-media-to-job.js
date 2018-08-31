'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'jobs',
				'image_path',
				{
					type: Sequelize.TEXT,
					allowNull: true,
					after: 'activity_field_id'
				}
			),
			queryInterface.addColumn(
				'jobs',
				'video_url',
				{
					type: Sequelize.TEXT,
					allowNull: true,
					after: 'image_path'
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
