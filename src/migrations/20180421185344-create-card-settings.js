'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('card_settings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			card_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				unique: true
			},
			visible: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
			},
			shareable: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
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
    return queryInterface.dropTable('card_settings');
  }
};
