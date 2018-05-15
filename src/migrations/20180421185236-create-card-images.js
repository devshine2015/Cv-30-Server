'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('card_images', {
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
			filename: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			name: {
				type: Sequelize.STRING(255),
				allowNull: false,
				validate: {
						max: { args: [255], msg: "Maximum 255 characters are allowed for the name" }
				}
			},
			type: {
				type: Sequelize.ENUM('jpeg', 'png'),
				allowNull: false,
				validate: {
						isIn: { args: [['jpeg', 'png']], msg: "Only accepting pngs or jpegs" }
				}
			},
			width: {
				type: Sequelize.DOUBLE(12, 2),
				allowNull: true,
				defaultValue: 0
			},
			height: {
				type: Sequelize.DOUBLE(12, 2),
				allowNull: true,
				defaultValue: 0
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
    return queryInterface.dropTable('card_images');
  }
};
