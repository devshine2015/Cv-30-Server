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
			companyId: {
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'company_id'
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
		})
		.then(() => queryInterface.addIndex('teams', { fields: ['company_id'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('teams');
	}
};