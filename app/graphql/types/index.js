const User = require('./user');
const Response = require('./response');
const Profile = require('./profile');
const Error = require('./error');
const Article = require('./article');
const Salary = require('./salary');
const Company = require('./company');
const Job = require('./job');

const TeamInput = `
	input TeamInput {
		id: String
	}
`;

const QAInput = `
	input QAInput {
		id: String
	}
`;

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
		setStory(
			language: LanguageCodeType!
			title: String
			description: String
		): StandardResponse
		setSalary(salary: SalaryInput): StandardResponse
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
		setContact (
			phone: String
			email: String
			facebook: String
			linkedin: String
		): StandardResponse
		setProject (
			id: String 
			location: Int
			isCurrent: Boolean
			position: String
			company: String
			startDate: Date
			endDate: Date
			title: String
			description: String
			language: LanguageCodeType!
		): StandardResponse
		removeProject (
			id: String
		): StandardResponse
		setExperience (
			id: String
			location: Int
			isCurrent: Boolean
			position: String
			company: String
			startDate: Date
			endDate: Date
			title: String
			description: String
			language: LanguageCodeType!
		): StandardResponse
		removeExperience (
			id: String
		): StandardResponse
		handleCompany(
			language: LanguageCodeType!
			details: CompanyInput
		): StandardResponse
		handleArticle (
			language: LanguageCodeType!
			article: ArticleInput
			options: ArticleOptions
		): StandardResponse
		handleTeam (
			team: TeamInput
		): StandardResponse
		handleQA (
			qa: QAInput
		): StandardResponse
		handleJob (
			language: LanguageCodeType!
			jobDetails: JobInput
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

module.exports = [SchemaDefinition, Company, Job, Article, Salary, Query, User, Profile, Response, TeamInput, QAInput, Error];