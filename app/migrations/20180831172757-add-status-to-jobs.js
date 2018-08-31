'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'jobs',
			'status',
			{
				allowNull: false,
				defaultValue: 'active',
				type: Sequelize.ENUM('draft', 'active', 'archived'),
				after: 'video_url'
			}
		).then(() => queryInterface.changeColumn(
			'jobs',
			'status',
			{
				allowNull: false,
				defaultValue: 'draft',
				type: Sequelize.ENUM('draft', 'active', 'archived')
			}
		));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('jobs', 'status');
	}
};
