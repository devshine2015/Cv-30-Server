'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('places', {
			companyId: {
				allowNull: false,
				type: Sequelize.UUID,
				validate: {
					isUUID: 4
				},
				field: 'company_id',
				primaryKey: true
			},
			addressComponents: {
				allowNull: true,
				type: Sequelize.TEXT,
				field: 'address_components'
			},
        	formattedAddress: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'formatted_address'
			},
			latitude: {
				allowNull: true,
				type: Sequelize.DOUBLE(12, 2),
				field: 'latitude'
			},
			longitude: {
				allowNull: true,
				type: Sequelize.DOUBLE(12, 2),
				field: 'longitude'
			},
			internationalPhoneNumber: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'international_phone_number'
			},
			name: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'name'
			},
			placeId: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'place_id'
			},
			compoundCode: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'compound_code'
			},
			globalCode: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'compound_code'
			},
			rating: {
				allowNull: true,
				type: Sequelize.FLOAT(2, 1),
				field: 'rating'
			},
			reviews: {
				allowNull: true,
				type: Sequelize.TEXT,
				field: 'reviews'
			},
        	types: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'types'
			},
        	googleUrl: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'google_url'
			},
        	website: {
				allowNull: true,
				type: Sequelize.STRING(255),
				field: 'website'
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
		return queryInterface.dropTable('places');
	}
};