'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('users', [{
			uid: '4n5pxq24kpiob12og9',
			email: 'contact@wowzaaa.io',
			salt: '$2a$12$BPC60qbiTiQ9JEkok8wXHuZJpWmjoM0p434ZshlA0xMlkt4Mb5MNe',
			hash: '$2a$12$y/341/tER2E2BgN4dZL7YeG6qtjWxJPJSWjvGroZmZi/h92McFZ0K',
			status: 'active',
			first_name: 'Wowzaaa',
			last_name: 'DevTeam',
			created_at: new Date,
			updated_at: new Date
		}], {});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('users', {
			uid: '4n5pxq24kpiob12og9',
			email: 'contact@wowzaaa.io',
			salt: '$2a$12$BPC60qbiTiQ9JEkok8wXHuZJpWmjoM0p434ZshlA0xMlkt4Mb5MNe',
			hash: '$2a$12$y/341/tER2E2BgN4dZL7YeG6qtjWxJPJSWjvGroZmZi/h92McFZ0K',
			status: 'active',
			first_name: 'Wowzaaa',
			last_name: 'DevTeam'
		}, {});
	}
};
