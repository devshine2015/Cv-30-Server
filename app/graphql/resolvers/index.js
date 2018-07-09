const authResolvers = require('./auth');
const userResolvers = require('./user');
const companyResolvers = require('./company');
const articleResolvers = require('./article');
const jobResolvers = require('./job');
const teamResolvers = require('./team');

module.exports = {
	Query: {
		profile: (_, { id, language }, context) => userResolvers.profile(id, language, context),
		profiles: (_, { language }, context) => userResolvers.all(language, context),
		companies: (_, { language }, context) => companyResolvers.all(language, context),
		company: (_, { id, language }, context) => companyResolvers.company(id, language, context),
		jobs: (_, { language }, context) => jobResolvers.all(language, context),
		job: (_, { id, language }, context) => jobResolvers.job(id, language, context),
		articles: (_, { language }, context) => articleResolvers.all(language, context),
		article: (_, { id, language }, context) => articleResolvers.article(id, language, context),
		teams: (_, { language }, context) => teamResolvers.all(language, context),
		team: (_, { id, language }, context) => teamResolvers.team(id, language, context),
		// profileFeaturedArticles: (_, __, context) => userResolvers.profileFeaturedArticles(context),
		// userSkills: (_, __, context) => userResolvers.userSkills(context),
		// userValues: (_, __, context) => userResolvers.userValues(context),
		// userExperience: (_, __, context) => userResolvers.userExperience(context),
		// userProjects: (_, __, context) => userResolvers.userProjects(context)
	},
	Mutation: {
		avatar: (_, { status, contentType }, context) => userResolvers.setAvatar(status, contentType, context),
		profileCover: (_, { status }, context) => userResolvers.setHasProfileCover(status, context),
		setCoverBackground: (_, { color }, context) => userResolvers.setCoverBackground(color, context),
		setSalary: (_, { salary }, context) => userResolvers.setSalary(salary, context),
		setStory: (_, { language, story }, context) => userResolvers.setStory(language, story, context),

		setValues: (_, { values, language }, context) => userResolvers.setValues(values, language, context),
		removeValue: (_, { id }, context) => userResolvers.removeValue(id, context),
		setSkills: (_, { skills, language }, context) => userResolvers.setSkills(skills, language, context),
		removeSkill: (_, { id }, context) => userResolvers.removeSkill(id, context),
		setContact: (_, { contact }, context) => userResolvers.setContact(contact, context),

		setProject: (_, { project, language }, context) => userResolvers.setProject(project, language, context),
		removeProject: (_, { id }, context) => userResolvers.removeProject(id, context),
		
		setExperience: (_, { experience, language }, context) => userResolvers.setExperience(experience, language, context),
		removeExperience: (_, { id }, context) => userResolvers.removeExperience(id, context),

		handleCompany: (_, { language, details }, context) => companyResolvers.handleCompany(language, details, context),
		setTags: (_, { language, tagsInput }, context) => companyResolvers.setTags(language, tagsInput, context),
		removeTag: (_, { id, companyId }, context) => companyResolvers.removeTag(id, companyId, context),

		handleArticle: (_, { language, article, options }, context) => articleResolvers.handleArticle(language, article, options, context),

		handleTeam: (_, { teamDetails }, context) => teamResolvers.handleTeam(teamDetails, context),
		addMemberToTeam: (_, { teamId, memberId }, context) => teamResolvers.addMemberToTeam(teamId, memberId, context),
		removeMemberFromTeam: (_, { teamId, memberId }, context) => teamResolvers.removeMemberFromTeam(teamId, memberId, context),

		handleFAQ: (_, { language, faq }, context) => companyResolvers.handleFAQ(language, faq, context),
		
		handleJob: (_, { language, jobDetails }, context) => jobResolvers.handleJob(language, jobDetails, context),

		register: (_, { nickname, email, password }, context) => authResolvers.createAccount(nickname, email, password, context),
		login: (_, { email, password }, context) => authResolvers.attemptLogin(email, password, context),
		logout: (_, __, context) => authResolvers.attemptLogout(context),
		checkTokens: (_, { token, refreshToken }, context) => authResolvers.checkTokens(token, refreshToken, context),
		forgotPassword: (_, { email }, context) => authResolvers.forgotPasswordSendCode(email, context),
		checkResetToken: (_, { token }, context) => authResolvers.forgotPasswordCheckToken(token, context),
		updateForgotPassword: (_, { token, password }, context) => authResolvers.forgotPasswordUpdate(token, password, context),
		activateAccount: (_, { token }, context) => authResolvers.activateAccount(token, context),
		updateUserSettings: (_, { userSettings }, context) => authResolvers.updateUserSettings(userSettings, context),
	}
};