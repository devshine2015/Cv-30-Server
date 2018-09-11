'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'companies',
			'logo_path',
			{
				type: Sequelize.TEXT,
				allowNull: true,
				after: 'logo_content_type'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'companies',
				'cover_path',
				{
					type: Sequelize.TEXT,
					allowNull: true,
					after: 'cover_content_type'
				}
			)
			.then(() =>
				queryInterface.addColumn(
					'landing_pages',
					'cover_path',
					{
						type: Sequelize.TEXT,
						allowNull: true,
						after: 'cover_content_type'
					}
				)
				.then(() =>
					queryInterface.addColumn(
						'landing_pages',
						'footer_cover_path',
						{
							type: Sequelize.TEXT,
							allowNull: true,
							after: 'footer_cover_content_type'
						}
					)
					.then(() =>
						queryInterface.addColumn(
							'profiles',
							'avatar_path',
							{
								type: Sequelize.TEXT,
								allowNull: true,
								after: 'avatar_content_type'
							}
						)
						.then(() =>
							queryInterface.addColumn(
								'profiles',
								'cover_path',
								{
									type: Sequelize.TEXT,
									allowNull: true,
									after: 'profile_cover_content_type'
								}
							)
							.then(() =>
								queryInterface.addColumn(
									'teams',
									'cover_path',
									{
										type: Sequelize.TEXT,
										allowNull: true,
										after: 'cover_content_type'
									}
								)
							)
						)
					)
				)
			)
		);
	},

	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('companies', 'logo_path'),
			queryInterface.removeColumn('companies', 'cover_path'),

			queryInterface.removeColumn('landing_pages', 'cover_path'),
			queryInterface.removeColumn('landing_pages', 'footer_cover_path'),
			
			queryInterface.removeColumn('profiles', 'avatar_path'),
			queryInterface.removeColumn('profiles', 'cover_path'),

			queryInterface.removeColumn('teams', 'cover_path')
		];
	}
};
