'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('faqs', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		companyId: {
			allowNull: false,
			type: Sequelize.UUID,
			validate: {
					isUUID: 4
				},
			field: 'company_id',
		},
		question: {
			allowNull: true,
			type: Sequelize.TEXT,
			field: 'question'
		},
		answer: {
			allowNull: true,
			type: Sequelize.TEXT,
			field: 'answer'
		},
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE,
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE,
			field: 'updated_at'
		}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('faqs');
	}
};