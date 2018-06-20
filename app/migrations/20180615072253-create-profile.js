'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('profiles', {
			userId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'user_id'
			},
			hasAvatar: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'has_avatar'
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
		return queryInterface.dropTable('profiles');
	}
};