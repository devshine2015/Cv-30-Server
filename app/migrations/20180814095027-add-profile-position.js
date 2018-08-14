'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'profiles',
				'position',
				{
					type: Sequelize.STRING(255),
					allowNull: true,
					after: 'cover_background'
				}
			)
		];
	},

	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('profiles', 'position'),
		];
	}
};
