'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
			queryInterface.addColumn(
				'users',
				'cv_file',
				{
          type: Sequelize.STRING(255),
          allowNull: true,
          validate: {
              max: { args: [255], msg: "Maximum 255 characters are allowed for the email address" }
          },
          field: 'cv_file',
          after: 'last_name'
        }
			)
		];
  },

  down: (queryInterface, Sequelize) => {
    return [
			queryInterface.removeColumn('users', 'cv_file')
		];
  }
};
