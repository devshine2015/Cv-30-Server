'use strict';
module.exports = (sequelize, DataTypes) => {
	var place = sequelize.define('place', {
		companyId: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			},
			field: 'company_id',
			primaryKey: true
		},
		addressComponents: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'address_components'
		},
		formattedAddress: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'formatted_address'
		},
		latitude: {
			allowNull: true,
			type: DataTypes.DOUBLE(12, 2),
			field: 'latitude'
		},
		longitude: {
			allowNull: true,
			type: DataTypes.DOUBLE(12, 2),
			field: 'longitude'
		},
		internationalPhoneNumber: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'international_phone_number'
		},
		name: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'name'
		},
		placeId: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'place_id'
		},
		compoundCode: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'compound_code'
		},
		globalCode: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'compound_code'
		},
		rating: {
			allowNull: true,
			type: DataTypes.FLOAT(2, 1),
			field: 'rating'
		},
		reviews: {
			allowNull: true,
			type: DataTypes.TEXT,
			field: 'reviews'
		},
		types: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'types'
		},
		googleUrl: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'google_url'
		},
		website: {
			allowNull: true,
			type: DataTypes.STRING(255),
			field: 'website'
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
		createdAt: 'created_at'
	});
	place.associate = models => {
		
  	};
  	return place;
};