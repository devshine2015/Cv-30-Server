'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Project = Sequelize.define('project', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		userId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'user_id'
		},
		locationId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'location_id'
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
		indexes: [ { fields: ['user_id'] } ]
	});
	Project.associate = function(models) {
		Project.belongsTo(models.user, { as: 'owner' });
		// Project.belongsTo(models.location, { as: 'location' });
	};
	return Project;
};