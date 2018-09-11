'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'jobs',
			'title',
			{
				allowNull: true,
				type: Sequelize.STRING(255),
				after: 'team_id'
			}
		)
		.then(() =>
            queryInterface.addColumn(
				'jobs',
				'description',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'title'
				}
			)
			.then(() =>
				queryInterface.addColumn(
					'jobs',
					'ideal_candidate',
					{
						allowNull: true,
						type: Sequelize.TEXT,
						after: 'description'
					}
				)
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('jobs', 'title'),
            queryInterface.removeColumn('jobs', 'description'),
            queryInterface.removeColumn('jobs', 'ideal_candidate')
		];
	}
};