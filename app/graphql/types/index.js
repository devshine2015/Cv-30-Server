const User = require('./user');
const Response = require('./response');
const Profile = require('./profile');
const Error = require('./error');
const Article = require('./article');
const Salary = require('./salary');
const Company = require('./company');
const Job = require('./job');
const Team = require('./team');

const Query = `
	type Query {
		profile(
			id: String
			language: LanguageCodeType!
		): Profile
		articles(
			language: LanguageCodeType!
		): [Article]
		article(
			id: String!
			language: LanguageCodeType!
		): Article
		profiles(
			language: LanguageCodeType!
		): [Profile]
		companies(
			language: LanguageCodeType!
		): [Company]
		company(
			id: String!
			language: LanguageCodeType!
		): Company
		users(
			language: LanguageCodeType!
		): [Profile]
		jobs(
			language: LanguageCodeType!
		): [Job]
		job(
			id: String!
			language: LanguageCodeType!
		): Job
		teams(
			language: LanguageCodeType!
		): [Team]
		team(
			id: String!
			language: LanguageCodeType!
		): Team
	}
	type Mutation {
		avatar ( status: Boolean, contentType: ImageType ): StandardResponse
		profileCover ( status: Boolean, contentType: ImageType ): StandardResponse
		setCoverBackground ( color: String ): StandardResponse
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
			project: ProjectInput!
			language: LanguageCodeType!
		): StandardResponse
		removeProject ( id: String ): StandardResponse
		setExperience (
			experience: ExperienceInput!
			language: LanguageCodeType!
		): StandardResponse
		removeExperience (
			id: String
		): StandardResponse
		handleCompany(
			language: LanguageCodeType!
			details: CompanyInput!
		): StandardResponse
		setTags(
			language: LanguageCodeType!
			tagsInput: TagsInput!
		): StandardResponse
		removeTag (
			id: Int!
			companyId: String!
		): StandardResponse
		handleArticle (
			language: LanguageCodeType!
			article: ArticleInput
			options: ArticleOptions
		): StandardResponse
		handleTeam (
			teamDetails: TeamInput!
		): StandardResponse
		addMemberToTeam (
			teamId: String!,
			memberId: String!
		): StandardResponse
		removeMemberFromTeam (
			teamId: String!,
			memberId: String!
		): StandardResponse
		handleFAQ (
			language: LanguageCodeType!
			faq: FaqInput!
		): StandardResponse
		handleJob (
			language: LanguageCodeType!
			jobDetails: JobInput!
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
		updateUserSettings (userSettings: UserSettingsInput): StandardResponse
		handleFollow (
			details: FollowInput!
		): StandardResponse
		handleApplyToJob (
			jobId: String!
			isApplying: Boolean!
		): StandardResponse
	}
`;

const SchemaDefinition = `
	schema {
		query: Query
		mutation: Mutation
 	}
`;

module.exports = [SchemaDefinition, Company, Job, Team, Article, Salary, Query, User, Profile, Response, Error];