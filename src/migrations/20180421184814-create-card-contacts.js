'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('card_contacts', {
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
        type: Sequelize.ENUM('phone', 'email'),
        allowNull: false,
				validate: {
						isIn: { args: [['phone', 'email']], msg: "Only accepting phone numbers or emails" }
				}
      },
      content: {
        type: Sequelize.STRING(255),
        allowNull: false,
				validate: {
						max: { args: [255], msg: "Maximum 255 characters are allowed for the email address" }
				}
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
    return queryInterface.dropTable('card_contacts');
  }
};
