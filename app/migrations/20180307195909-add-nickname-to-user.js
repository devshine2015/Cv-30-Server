'use strict';

module.exports = {
  	up: (queryInterface, Sequelize) => {
    	return [
			queryInterface.addColumn(
				'users',
				'nickname',
				{
					type: Sequelize.STRING(50),
					after: "uid",
					allowNull: false,
					validate: {
						len: [1, 50]
					}
				}
			)
		];
  	},
  	down: (queryInterface, Sequelize) => {
    	return [
      		queryInterface.removeColumn('users', 'nickname')
    	];
  	}
};