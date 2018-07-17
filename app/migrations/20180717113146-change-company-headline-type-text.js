'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('company_i18n', 'headline', {
			type: Sequelize.TEXT
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('company_i18n', 'headline', {
			type: Sequelize.STRING(255)
		});
	}
};
