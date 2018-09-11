'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'companies',
			'hasProfileCover',
			{
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
				field: 'has_profile_cover'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'companies',
				'coverContentType',
				{
					allowNull: true,
					type: Sequelize.ENUM('jpeg', 'png', 'gif'),
					field: 'cover_content_type'
				}
			)
			.then(() =>
				queryInterface.addColumn(
					'companies',
					'coverBackground',
					{
						allowNull: true,
						defaultValue: '',
						type: Sequelize.STRING(255),
						field: 'cover_background'
					}
				)
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('companies', 'hasProfileCover'),
			queryInterface.removeColumn('companies', 'coverContentType'),
			queryInterface.removeColumn('companies', 'coverBackground')
		];
	}
};