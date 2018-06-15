'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Article = Sequelize.define('article', {
    	id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		uid: {
			type: DataTypes.STRING(36),
            allowNull: false,
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
		is_featured: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_featured'
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
			{ fields: ['user_id', 'is_featured'] }
		]
	});
	Article.associate = models => {
		Article.belongsTo(models.user, { as: 'author', foreignKey: 'user_id' });
		Article.hasMany(models.articleText, { as: 'texts' });
    	Article.hasMany(models.image, { as: 'images' });
	};
	return Article;
};