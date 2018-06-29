'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('company_tags', {
			companyId: {
				primaryKey: true,
				type: Sequelize.UUID,
                validate: {
                    isUUID: 4
                },
				allowNull: false,
				field: 'company_id'
			},
			tagId: {
				primaryKey: true,
				type: Sequelize.INTEGER,
				allowNull: false,
				field: 'tag_id'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'created_at',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at'
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('company_tags');
	}
};
