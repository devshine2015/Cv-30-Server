const uuid = require('uuidv4');

'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('images', {
			id: {
				allowNull: false,
				primaryKey: true,
				defaultValue: uuid(),
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
			},
			userId: {
				allowNull: false,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				field: 'user_id'
			},
			sourceId: {
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'source_id'
			},
			sourceType: {
				allowNull: false,
				type: Sequelize.ENUM('article', 'profile', 'profile_cover', 'company', 'company_cover', 'job', 'team', 'experience', 'project', 'education', 'hobby'),
				field: 'source_type'
			},
			isFeatured: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_featured'
			},
			path: {
				type: Sequelize.STRING(255),
				allowNull: false,
				field: 'path'
			},
			originalFilename: {
				type: Sequelize.STRING(255),
				allowNull: true,
				field: 'original_filename'
			},
			filename: {
				type: Sequelize.STRING(255),
				allowNull: true,
				validate: {
					isUUID: 4
				},
				field: 'filename'
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
		.then(() => queryInterface.addIndex('images', { fields: ['user_id']}))
		.then(() => queryInterface.addIndex('images', { fields: ['source_id']}))
		.then(() => queryInterface.addIndex('images', { fields: ['source_type'] }))
		.then(() => queryInterface.addIndex('images', { fields: ['user_id', 'source_id'] }))
		.then(() => queryInterface.addIndex('images', { fields: ['user_id', 'source_id', 'source_type'] }))
		.then(() => queryInterface.addIndex('images', { unique: true, fields: ['user_id', 'source_id', 'source_type', 'is_featured'] }));
	},
	down: (queryInterface, Sequelize) => {
    	return queryInterface.dropTable('images');
  	}
};