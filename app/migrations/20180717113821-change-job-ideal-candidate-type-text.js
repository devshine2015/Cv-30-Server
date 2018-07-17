'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('job_i18n', 'ideal_candidate', {
			type: Sequelize.TEXT
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('job_i18n', 'ideal_candidate', {
			type: Sequelize.STRING(255)
		});
	}
};
