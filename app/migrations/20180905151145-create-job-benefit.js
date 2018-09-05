'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		const jobBenefits = [
			{
				icon: 'fas fa-car-side',
				key: 'car'
			},
			{
				icon: 'fas fa-laptop',
				key: 'laptop'
			},
			{
				icon: 'fas fa-mobile',
				key: 'mobile'
			},
			{
				icon: 'far fa-coffee',
				key: 'coffee'
			},
			{
				icon: 'fas fa-cookie-bite',
				key: 'snacks'
			},
			{
				icon: 'fas fa-newspaper',
				key:'mealTickets'
			},
			{
				icon: 'fas fa-graduation-cap',
				key: 'courses'
			},
			{
				icon: 'far fa-clock',
				key: 'flexSchedule'
			},
			{
				icon: 'far fa-briefcase-medical',
				key: 'medical'
			},
			{
				icon: 'far fa-tooth',
				key: 'dental'
			},
			{
				icon: 'fas fa-subway',
				key: 'commuteSubsidy'
			},
			{
				icon: 'far fa-child',
				key: 'child'
			},
			{
				icon: 'far fa-dumbbell',
				key: 'gym'
			},
			{
				icon: 'far fa-home',
				key: 'housing'
			},
			{
				icon: 'far fa-briefcase',
				key: 'paidVacation'
			},
			{
				icon: 'far fa-book-reader',
				key: 'books'
			},
			{
				icon: 'fas fa-child',
				key: 'maternityLeave'
			},
			{
				icon: 'fal fa-couch',
				key: 'relaxArea'
			},
			{
				icon: 'fal fa-brain',
				key: 'coaching'
			},
			{
				icon: 'fas fa-chess-board',
				key: 'games'
			},
			{
				icon: 'fal fa-globe',
				key: 'intExperience'
			},
			{
				icon: 'fal fa-file-signature',
				key: 'stocks'
			},
			{
				icon: 'fas fa-dollar-sign',
				key: 'profitSharing'
			},
			{
				icon: 'far fa-grin-stars',
				key: 'sabbatic'
			},
			{
				icon: 'fal fa-ticket',
				key: 'eventTickets'
			},
			{
				icon: 'fal fa-users',
				key: 'family'
			},
		];
		const date = new Date();
		const timestamps = { 
			created_at: date,
			updated_at: date
		};

		return [
			queryInterface.createTable('job_benefits', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				key: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				icon: {
					type: Sequelize.TEXT,
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
			}).then(() => queryInterface.bulkInsert('job_benefits', jobBenefits.map((item, index) => ({
				id: index + 1,
				...item,
				...timestamps
			})))),
			queryInterface.createTable('job_job_benefits', {
				jobId: {
					primaryKey: true,
					type: Sequelize.UUID,
					validate: {
						isUUID: 4
					},
					allowNull: false,
					field: 'job_id'
				},
				jobBenefitId: {
					primaryKey: true,
					type: Sequelize.INTEGER,
					allowNull: false,
					field: 'job_benefit_id'
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
					createdAt: 'created_at',
					freezeTableName: true,
					tableName: 'job_job_types'
				})
		]
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.dropTable('job_job_benefits'),
			queryInterface.dropTable('job_benefits')
		]
	}
};