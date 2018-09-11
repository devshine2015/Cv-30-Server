'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'companies',
			'has_logo',
			{
				allowNull: true,
				defaultValue: false,
				type: Sequelize.BOOLEAN
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'companies',
				'logo_content_type',
				{
					allowNull: true,
					type: Sequelize.ENUM('jpeg', 'png', 'gif')
				}
			)
			.then(() =>
				queryInterface.renameColumn(
					'companies',
					'hasProfileCover',
					'has_cover'
				)
				.then(() =>
					queryInterface.renameColumn(
						'companies',
						'coverContentType',
						'cover_content_type'
					)
					.then(() =>
						queryInterface.renameColumn(
							'companies',
							'coverBackground',
							'cover_background'
						)
					)
				)
			)
		);
	},
	down: (queryInterface, Sequelize) => {
		return [
			queryInterface.removeColumn('companies', 'has_logo'),
			queryInterface.removeColumn('companies', 'logo_content_type'),
			queryInterface.renameColumn('companies', 'has_cover', 'hasProfileCover'),
			queryInterface.renameColumn('companies', 'cover_content_type', 'coverContentType'),
			queryInterface.renameColumn('companies', 'cover_background', 'coverBackground')
		];
	}
};
