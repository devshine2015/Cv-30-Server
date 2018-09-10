'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'article_tags',
				'title',
				{
					allowNull: true,
					type: Sequelize.STRING(255),
					after: 'id'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('article_tags', 'title')
		];
	}
};
