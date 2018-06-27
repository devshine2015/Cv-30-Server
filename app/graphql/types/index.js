const User = require('./user');
const Response = require('./response');
const Profile = require('./profile');
const Error = require('./error');

const Query = `
	type Query {
		profile(
			id: Int
			language: LanguageCodeType!
		): Profile
		articles(
			language: LanguageCodeType!
		): [Article]
		article(
			id: Int!
			language: LanguageCodeType!
		): Article
		profiles(
			language: LanguageCodeType!
		): [Profile]
	}
	type Mutation {
		avatar (status: Boolean): Profile
		profileCover (status: Boolean): Profile
		setCoverBackground (color: String): Profile
		setValues (
			values: [String!]!
			language: LanguageCodeType!
		): StandardResponse
		removeValue (
			id: Int
		): StandardResponse
		setSkills (
			skills: [String!]!
			language: LanguageCodeType!
		): StandardResponse
		removeSkill (
			id: Int
		): StandardResponse
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

module.exports = [SchemaDefinition, Query, User, Profile, Response, Error];