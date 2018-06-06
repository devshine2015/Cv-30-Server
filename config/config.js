'use strict';

var dotenv = require('dotenv').config();

module.exports = {
	development: {
		database: process.env.DB_DATABASE,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		dialect: 'mysql',
		freezeTableName: true,
		operatorsAliases: false,
		define: {
			underscored: true
		},
		seederStorage: 'sequelize'
	},
	production: {
		database: process.env.DB_DATABASE,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 3306,
		dialect: 'mysql',
		freezeTableName: true,
		omitNull: true,
		operatorsAliases: false,
		define: {
			underscored: true
		},
		seederStorage: 'sequelize'
	}
};