'use strict';
module.exports = (Sequelize, DataTypes) => {
	var Experience = Sequelize.define('experience', {
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
			type: DataTypes.STRING(100),
			allowNull: false
		},
		company: {
			type: DataTypes.STRING(100),
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
		indexes: [
			{ fields: ['user_id'] },
			{ fields: ['location_id'] },
			{ fields: ['user_id', 'location_id'] }
		],
		freezeTableName: true,
		tableName: 'experience'
	});
  	Experience.associate = models => {
		Experience.belongsTo(models.user, { as: 'owner' });
		// Experience.belongsTo(models.location, { as: 'location' });
  	};
  	return Experience;
};