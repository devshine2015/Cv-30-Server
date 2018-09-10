'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'articles',
				'title',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'user_id'
				}
			),
			queryInterface.addColumn(
				'articles',
				'slug',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'title'
				}
			),
			queryInterface.addColumn(
				'articles',
				'description',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'slug'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('articles', 'title'),
			queryInterface.removeColumn('articles', 'slug'),
			queryInterface.removeColumn('articles', 'description')
		];
	}
};
