const User = require('./user');
const Response = require('./response');
const Profile = require('./profile');
const Error = require('./error');
const Article = require('./article');
const Salary = require('./salary');
const Company = require('./company');
const Job = require('./job');
const Team = require('./team');

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
		companies(
			language: LanguageCodeType!
		): [Company]
		users(
			language: LanguageCodeType!
		): [Profile]
		jobs(
			language: LanguageCodeType!
		): [Job]
	}
	type Mutation {
		avatar ( status: Boolean ): Profile
		profileCover ( status: Boolean ): Profile
		setCoverBackground ( color: String ): Profile
		setStory(
			story: StoryInput
			language: LanguageCodeType!
		): StandardResponse
		setSalary( salary: SalaryInput ): StandardResponse
		setValues (
			values: [String!]!
			language: LanguageCodeType!
		): StandardResponse
		removeValue ( id: Int ): StandardResponse
		setSkills (
			skills: [String!]!
			language: LanguageCodeType!
		): StandardResponse
		removeSkill (
			id: Int
		): StandardResponse
		setContact ( contact: ContactInput ): StandardResponse
		setProject (
			project: ProjectInput
			language: LanguageCodeType!
		): StandardResponse
		removeProject ( id: String ): StandardResponse
		setExperience (
			experience: ExperienceInput
			language: LanguageCodeType!
		): StandardResponse
		removeExperience (
			id: String
		): StandardResponse
		handleCompany(
			language: LanguageCodeType!
			details: CompanyInput!
		): StandardResponse
		handleArticle (
			language: LanguageCodeType!
			article: ArticleInput
			options: ArticleOptions
		): StandardResponse
		handleTeam (
			teamDetails: TeamInput
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

module.exports = [SchemaDefinition, Company, Job, Team, Article, Salary, Query, User, Profile, Response, QAInput, Error];