'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('profiles', 'cover_background', {
			type: Sequelize.STRING(255)
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('profiles', 'cover_background', {
			type: Sequelize.STRING(100)
		});
	}
};
