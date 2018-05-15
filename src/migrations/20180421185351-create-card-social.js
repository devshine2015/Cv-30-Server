'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('card_social', {
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
				type: Sequelize.ENUM('url', 'facebook', 'twitter', 'instagram'),
				allowNull: false,
				validate: {
						isIn: { args: [['url', 'facebook', 'twitter', 'instagram']], msg: "Only accepting urls, facebook, twitter or instagram" }
				}
			},
			content: {
				type: Sequelize.STRING(255),
				allowNull: false,
				validate: {
						max: { args: [255], msg: "Maximum 255 characters are allowed for the social links" }
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
    return queryInterface.dropTable('card_social');
  }
};
