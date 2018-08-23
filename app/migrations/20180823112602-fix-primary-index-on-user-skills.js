'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('user_skills', 'id')
			.then(() => queryInterface.addConstraint('user_skills', ['user_id', 'skill_id'], { type: 'primary key' }));
	},

	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeIndex('user_skills', 'PRIMARY'),
			queryInterface.addColumn(
				'user_skills',
				'id',
				{
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
					first: true
				}
			)
		];
	}
};
