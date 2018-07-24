'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('landing_pages', {
			id: {
                allowNull: false,
                // autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
			},
            hasCover: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'has_cover'
			},
			coverContentType: {
				allowNull: true,
				type: Sequelize.ENUM('jpeg', 'png', 'gif'),
				field: 'cover_content_type'
			},
			coverBackground: {
				allowNull: true,
				defaultValue: '',
				type: Sequelize.STRING(100),
				field: 'cover_background'
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
		}, {
			timestamps: true,
			updatedAt: 'updated_at',
			createdAt: 'created_at'
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('landing_pages');
	}
};