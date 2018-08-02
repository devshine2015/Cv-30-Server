'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'articles',
				'is_post',
				{
					allowNull: false,
					defaultValue: false,
					type: Sequelize.BOOLEAN,
					after: 'is_about_me'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('articles', 'is_post')
		];
	}
};
