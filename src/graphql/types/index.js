import Card from './card';
import User from './user';
import Response from './response';

const Query = `
	type Query {
		cards: [Card]
		card(id: Int!): Card
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
		storeCard( details: CardInput ): Card
		activateAccount (token: String!): StandardResponse
	}
`;

const SchemaDefinition = `
	schema {
		query: Query
		mutation: Mutation
 	}
`;

export default [SchemaDefinition, Query, Card, User, Response];