const Auth = require('./auth');
const User = require('./user');
const Response = require('./response');
const Profile = require('./profile');
const Error = require('./error');
const Article = require('./article');
const Salary = require('./salary');
const Company = require('./company');
const Job = require('./job');
const Team = require('./team');
const LandingPage = require('./landingPage');
const ShallowUser = require('./shallowUser');

const Query = `
	type Query {
		_empty: String
	}
	type Mutation {
		_empty: String
	}
`;

const SchemaDefinition = `
	schema {
		query: Query
		mutation: Mutation
 	}
`;

module.exports = [SchemaDefinition, Query, Company, Job, Team, Article, Salary, Auth, User, Profile, Response, Error, LandingPage, ShallowUser];