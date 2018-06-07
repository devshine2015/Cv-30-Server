const User = require('./user');
const Response = require('./response');

const Query = `
	type Query {
		users: [User]
		user(id: Int!): User
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

module.exports = [SchemaDefinition, Query, User, Response];