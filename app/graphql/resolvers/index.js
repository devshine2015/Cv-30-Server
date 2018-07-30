const authResolvers = require('./auth');
const userResolvers = require('./user');
const companyResolvers = require('./company');
const articleResolvers = require('./article');
const jobResolvers = require('./job');
const teamResolvers = require('./team');
const landingPageResolvers = require('./landingPage');
const { merge } = require('lodash');

module.exports = merge(
	authResolvers,
	userResolvers,
	companyResolvers,
	articleResolvers,
	jobResolvers,
	teamResolvers,
	landingPageResolvers
);