'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'articles',
			'posting_team_id',
			{
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				allowNull: true,
				after: 'is_post'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'articles',
				'posting_company_id',
				{
					type: Sequelize.UUID,
                	validate: {
                    	isUUID: 4
                	},
                	allowNull: true,
					after: 'is_post'
				}
			)
			.then(() =>
				queryInterface.addColumn(
					'articles',
					'post_as',
					{
						type: Sequelize.ENUM('profile', 'team', 'company'),
						defaultValue: 'profile',
						allowNull: false,
						after: 'is_post'
					}
				)
				.then(() =>
					// Never used table, don't worry that down doesn't bring it back
					queryInterface.dropTable('article_endorsers')
				)
			)
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('articles', 'post_as')
		.then(() => queryInterface.removeColumn('articles', 'posting_company_id')
		.then(() => queryInterface.removeColumn('articles', 'posting_team_id')
		));
	}
};
