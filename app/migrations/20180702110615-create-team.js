'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('teams', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				}
			},
			name: {
				allowNull: true,
				type: Sequelize.STRING(255)
			},
			hasProfileCover: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'has_profile_cover'
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
		return queryInterface.dropTable('teams');
	}
};