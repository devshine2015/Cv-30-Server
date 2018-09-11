'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'landing_pages',
			'footer_cover_background',
			{
				allowNull: true,
				defaultValue: '',
				type: Sequelize.STRING(100),
				after: 'cover_background'
			}
		)
		.then(() =>
			queryInterface.addColumn(
				'landing_pages',
				'footer_cover_content_type',
				{
					allowNull: true,
					type: Sequelize.ENUM('jpeg', 'png', 'gif'),
					after: 'cover_background'
				}
			)
			.then(() =>
				queryInterface.addColumn(
					'landing_pages',
					'has_footer_cover',
					{
						allowNull: true,
						defaultValue: false,
						type: Sequelize.BOOLEAN,
						after: 'cover_background'
					}
				)
				.then(() =>
					queryInterface.addColumn(
						'landing_page_i18n',
						'footer_message',
						{
							type: Sequelize.TEXT,
							allowNull: true,
							after: 'headline'
						}
					)
					.then(() =>
						queryInterface.changeColumn(
							'landing_page_i18n',
							'headline',
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
		return [
			queryInterface.removeColumn('landing_pages', 'has_footer_cover'),
			queryInterface.removeColumn('landing_pages', 'footer_cover_content_type'),
			queryInterface.removeColumn('landing_pages', 'footer_cover_background'),
			queryInterface.removeColumn('landing_page_i18n', 'headline'),
			queryInterface.changeColumn('landing_page_i18n', 'headline', { type: Sequelize.STRING(100) })
		];
	}
};
