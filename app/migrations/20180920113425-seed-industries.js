'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		const date = new Date();
		const timestamps = { 
			created_at: date,
			updated_at: date
		};
		const industries = [
			'agriculture',
			'business-services',
			'computer-and electronics',
			'consumer-services',
			'education',
			'energy-and utilities',
			'banks',
			'financial-services',
			'government',
			'health',
			'pharmaceuticals',
			'biotech',
			'manufacturing',
			'media',
			'entertainment',
			'non-profit',
			'real-estate',
			'construction',
			'retail',
			'hardware',
			'software',
			'telecommunications',
			'transportation',
			'storage',
			'travel-recreation',
			'food-industry',
			'arts',
			'insurance',
			'audit',
			'bpo',
			'call-center',
			'chemical-industry',
			'translations',
			'human-resources',
			'marketing',
			'legal',
			'human-medicine',
			'labor-protection',
			'automtive-equipment',
			'veterinary-medicine',
			'oil-gas',
			'sport-wellness',
			'advertising',
			'beauty',
			'textiles-industry',
			'sales',
			'logistics',
			'tourism',
			'arhitecture',
			'interior-design',
			'security',
			'printing-publishing',
			'alternative-medicine',
			'engineering',
			'environmental-protection',
			'public-relations',
			'naval-aeronautical',
			'research-deveopement',
			'statistics-mathematics',
			'internet-e-commerce',
			'journalism-editorial'
		];

		return queryInterface.bulkDelete('industries', {})
		.then(() => queryInterface.removeColumn('industries', 'title'))
		.then(() =>	queryInterface.addColumn('industries', 'key', {
			type: Sequelize.TEXT,
			allowNull: false,
			after: 'id'
		}))
		.then(() => queryInterface.bulkInsert('industries', industries.map(key => ({
			key,
			...timestamps
		}))));
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('industries', 'key')
		.then(() => queryInterface.addColumn('industries', 'title', {
			allowNull: true,
			type: Sequelize.STRING(255),
			after: 'id'
		}));
	}
};
