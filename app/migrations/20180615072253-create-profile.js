'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
		.createTable('profiles', {
			userId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.INTEGER,
				field: 'user_id'
			},
			isSalaryPublic: {
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'is_salary_public'
			},
			desiredSalary: {
				allowNull: true,
				defaultValue: 0,
				type: Sequelize.DOUBLE(14,2),
				field: 'desired_salary'
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
		return queryInterface.dropTable('profiles');
	}
};