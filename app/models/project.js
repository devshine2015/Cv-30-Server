'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Project = Sequelize.define('project', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
		},
		userId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			field: 'user_id'
		},
		location: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'location'
		},
		isCurrent: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
			field: 'is_current'
		},
		position: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		company: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		startDate: {
			allowNull: false,
			type: DataTypes.DATE,
			field: 'start_date'
		},
		endDate: {
			allowNull: true,
			type: DataTypes.DATE,
			field: 'end_date'
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
			indexes: [{ fields: ['user_id'] }]
		});
	Project.associate = function (models) {
		Project.belongsTo(models.user, { as: 'owner', foreignKey: 'user_id' });
		Project.hasMany(models.projectText, { as: 'i18n', foreignKey: 'project_id' });
		// Project.belongsTo(models.location, { as: 'location' });
		Project.hasMany(models.video, { as: 'videos', foreignKey: 'source_id' });
		Project.hasMany(models.image, { as: 'images', foreignKey: 'source_id' });
	};
	return Project;
};