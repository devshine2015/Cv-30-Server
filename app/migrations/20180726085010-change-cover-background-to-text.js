'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn(
			'companies',
			'cover_background',
			{
				type: Sequelize.TEXT
			}
		)
		.then(() =>
			queryInterface.changeColumn(
				'teams',
				'cover_background',
				{
					type: Sequelize.TEXT
				}
			)
			.then(() =>
				queryInterface.changeColumn(
					'profiles',
					'cover_background',
					{
						type: Sequelize.TEXT
					}
				)
				.then(() =>
					queryInterface.changeColumn(
						'landing_pages',
						'cover_background',
						{
							type: Sequelize.TEXT
						}
					)
					.then(() =>
						queryInterface.changeColumn(
							'landing_pages',
							'footer_cover_background',
							{
								type: Sequelize.TEXT
							}
						)
					)
				)
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn(
			'companies',
			'cover_background',
			{
				type: Sequelize.STRING(100)
			}
		)
		.then(() =>
			queryInterface.changeColumn(
				'teams',
				'cover_background',
				{
					type: Sequelize.STRING(100)
				}
			)
			.then(() =>
				queryInterface.changeColumn(
					'profiles',
					'cover_background',
					{
						type: Sequelize.STRING(100)
					}
				)
				.then(() =>
					queryInterface.changeColumn(
						'landing_pages',
						'cover_background',
						{
							type: Sequelize.STRING(100)
						}
					)
					.then(() =>
						queryInterface.changeColumn(
							'landing_pages',
							'footer_cover_background',
							{
								type: Sequelize.STRING(100)
							}
						)
					)
				)
			)
		);
	}
};
