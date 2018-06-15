'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Video = Sequelize.define('video', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		uid: {
			type: DataTypes.STRING(36),
            allowNull: true,
            validate: {
                isUUID: 4
            },
            field: 'uid'
		},
		userId: {
			allowNull: false,
			type: DataTypes.INTEGER,
            field: 'user_id'
		},
		sourceId: {
			allowNull: false,
			type: DataTypes.INTEGER,
            field: 'source_id'
		},
		target: {
			allowNull: false,
			type: DataTypes.ENUM('article','profile_cover','company_cover'),
            field: 'target'
		},
    	is_featured: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'isFeatured'
		},
    	path: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'path'
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'updated_at'
		}
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		indexes: [
			{ unique: true, fields: ['uid'] },
			{ fields: ['user_id'] },
			{ fields: ['source_id'] },
			{ fields: ['target'] },
			{ fields: ['user_id', 'source_id'] },
			{ fields: ['user_id', 'source_id', 'target'] },
			{ unique: true, fields: ['user_id', 'source_id', 'target', 'is_featured'] }
		]
	});
	Video.associate = models => {
		Video.belongsTo(models.article, { as: 'article', foreignKey: 'source_id' });
		Video.belongsTo(models.user, { as: 'user', foreignKey: 'source_id' });
		Video.belongsTo(models.user, { as: 'author' });
	};
	return Video;
};