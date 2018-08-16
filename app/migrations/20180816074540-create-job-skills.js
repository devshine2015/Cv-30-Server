'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('job_skills', {
			jobId: {
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				allowNull: false,
				field: 'job_id'
			},
			skillId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.INTEGER,
				field: 'skill_id'
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
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('job_skills');
	}
};
