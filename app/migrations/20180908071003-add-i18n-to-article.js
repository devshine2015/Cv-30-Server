'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction((t) =>
			queryInterface.addColumn(
				'articles',
				'title',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'user_id',
					transaction: t
				}
			).then(() =>
				queryInterface.addColumn(
					'articles',
					'slug',
					{
						allowNull: true,
						type: Sequelize.STRING(255),
						after: 'title',
						transaction: t
					}
				).then(() =>
					queryInterface.addColumn(
						'articles',
						'description',
						{
							allowNull: true,
							type: Sequelize.TEXT,
							after: 'slug',
							transaction: t
						}
					)
				)
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('articles', 'title'),
			queryInterface.removeColumn('articles', 'slug'),
			queryInterface.removeColumn('articles', 'description')
		];
	}
};
