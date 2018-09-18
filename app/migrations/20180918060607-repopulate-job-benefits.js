'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		const date = new Date();
		const timestamps = { 
			created_at: date,
			updated_at: date
		};
		const jobBenefits = ['event-tickets', 'children-care', 'private-clinic', 'coaching', 'coffee', 'commuting-subsidy', 'company-car', 'company-laptop', 'company-phone', 'dentist', 'disability-insurance', 'elder-care', 'family-benefits', 'free-books', 'games', 'gym-membership', 'housing', 'international-experiences', 'life-inisurance', 'meal-coupons', 'one-day-off', 'paid-maternity', 'paid-vacations', 'playground', 'professional-dev-program', 'profit-sharing', 'flexible-working-hours', 'relax-area', 'relocation-expenses', 'sabatic-leave', 'snacks', 'stock-option', 'team-bonding-events', 'trainings', 'tuition-reimbursment'];
		return queryInterface.dropTable('job_benefits')
		.then(() => queryInterface.createTable('job_benefits', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			key: {
				type: Sequelize.STRING(255),
				allowNull: false
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
		}))
		.then(() => queryInterface.bulkDelete('job_benefits', {}))
		.then(() => queryInterface.bulkInsert('job_benefits', jobBenefits.map(item => ({ key: item, ...timestamps }))));
	},
	down: (queryInterface, Sequelize) => {}
};
