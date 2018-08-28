'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.changeColumn(
				'articles',
				'post_as',
				{
					type: Sequelize.ENUM('profile', 'team', 'company', 'landingPage'),
                	defaultValue: 'profile',
					allowNull: false,
				}
			)
		]
	},

	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.changeColumn(
				'articles',
				'post_as',
				{
					type: Sequelize.ENUM('profile', 'team', 'company'),
                	defaultValue: 'profile',
					allowNull: false,
				}
			),
		]
	}
};
