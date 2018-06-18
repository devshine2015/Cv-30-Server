const User = require('./user');
const Response = require('./response');
const Profile = require('./profile');

const Query = `
	type Query {
		profile: Profile
	}
	type Mutation {
		register (
			nickname: String!
			email: String!
			password: String!
		): StandardResponse
		login (
			email: String!
			password: String!
		): LoginResponse
		logout: StandardResponse
		checkTokens (
			token: String
			refreshToken: String
		): CheckTokensResponse
		forgotPassword (
			email: String!
		): StandardResponse
		checkResetToken (
			token: String!
		): StandardResponse
		updateForgotPassword (
			token: String!
			password: String!
		): StandardResponse
		activateAccount (token: String!): StandardResponse
	}
`;

const SchemaDefinition = `
	schema {
		query: Query
		mutation: Mutation
 	}
`;

module.exports = [SchemaDefinition, Query, User, Profile, Response];