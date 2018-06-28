'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('company_office_articles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			company_id: {
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
                allowNull: false
			},
			article_id: {
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
                allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'created_at',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at'
			}
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('company_office_articles');
	}
};
