'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('videos', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			uid: {
				type: Sequelize.STRING(36),
				allowNull: true,
				validate: {
					isUUID: 4
				},
				field: 'uid'
			},
			userId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'user_id'
			},
			sourceId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				field: 'source_id'
			},
			target: {
				allowNull: false,
				type: Sequelize.ENUM('article','profile_cover','company_cover'),
				field: 'target'
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
		.then(() => queryInterface.addIndex('videos', { unique: true, fields: ['uid'] }))
		.then(() => queryInterface.addIndex('videos', { fields: ['user_id'] }))
		.then(() => queryInterface.addIndex('videos', { fields: ['source_id'] }))
		.then(() => queryInterface.addIndex('videos', { fields: ['target'] }))
		.then(() => queryInterface.addIndex('videos', { fields: ['user_id', 'source_id'] }))
		.then(() => queryInterface.addIndex('videos', { fields: ['user_id', 'source_id', 'target'] }))
		.then(() => queryInterface.addIndex('videos', { unique: true, fields: ['user_id', 'source_id', 'target', 'is_featured'] }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('videos');
	}
};