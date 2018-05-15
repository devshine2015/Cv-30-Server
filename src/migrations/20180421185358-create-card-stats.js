'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('card_stats', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			card_id: {
				allowNull: true,
				type: Sequelize.INTEGER,
				unique: true
			},
			views: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultContent: 0
			},
			shares: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultContent: 0
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
		});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('card_stats');
  }
};
