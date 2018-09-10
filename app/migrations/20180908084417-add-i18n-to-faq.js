'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return [
			queryInterface.addColumn(
				'faqs',
				'question',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'company_id'
				}
			),
            queryInterface.addColumn(
				'faqs',
				'answer',
				{
					allowNull: true,
					type: Sequelize.TEXT,
					after: 'question'
				}
			)
		];
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('faqs', 'question'),
            queryInterface.removeColumn('faqs', 'answer')
		];
	}
};