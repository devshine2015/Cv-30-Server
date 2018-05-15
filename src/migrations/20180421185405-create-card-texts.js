'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('card_texts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			card_id: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			order: {
        type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: 0
      },
			type: {
				type: Sequelize.ENUM('front', 'back'),
				allowNull: false,
				validate: {
						isIn: { args: [['front', 'back']], msg: "Only accepting front or back" }
				}
			},
			language: {
				type: Sequelize.ENUM('en'),
				allowNull: false,
				defaultContent: 'en',
				validate: {
						isIn: { args: [['en']], msg: "Only accepting EN" }
				}
			},
			content: {
				type: Sequelize.TEXT,
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
		});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('card_texts');
  }
};
