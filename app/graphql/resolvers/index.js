const authResolvers = require('./auth');
const userResolvers = require('./user');
const companyResolvers = require('./company');

module.exports = {
	Query: {
		profile: (_, { language, id = 0 }, context) => userResolvers.profile(id, language, context),
		// articles: (_, { language }, context) => articleResolvers.many(language, context),
		// article: (_, { id, language }, context) => articleResolvers.one(id, language, context)
		// profileFeaturedArticles: (_, __, context) => userResolvers.profileFeaturedArticles(context),
		// userSkills: (_, __, context) => userResolvers.userSkills(context),
		// userValues: (_, __, context) => userResolvers.userValues(context),
		// userExperience: (_, __, context) => userResolvers.userExperience(context),
		// userProjects: (_, __, context) => userResolvers.userProjects(context)
	},
	Mutation: {
		avatar: (_, { status }, context) => userResolvers.setAvatar(status, context),
		profileCover: (_, { status }, context) => userResolvers.setHasProfileCover(status, context),
		setCoverBackground: (_, { color }, context) => userResolvers.setCoverBackground(color, context),
		setValues: (_, { values, language }, context) => userResolvers.setValues(values, language, context),
		removeValue: (_, { id }, context) => userResolvers.removeValue(id, context),
		setSkills: (_, { skills, language }, context) => userResolvers.setSkills(skills, language, context),
		removeSkill: (_, { id }, context) => userResolvers.removeSkill(id, context),
		setContact: (_, { phone, email, facebook, linkedin }, context) => userResolvers.setContact(phone, email, facebook, linkedin, context),
		setProject: (_, { id, location, isCurrent, position, company, startDate, endDate }, context) => userResolvers.setProject(id, location, isCurrent, position, company, startDate, endDate, context),
		removeProject: (_, { id }, context) => userResolvers.removeProject(id, context),
		setExperience: (_, { id, location, isCurrent, position, company, startDate, endDate }, context) => userResolvers.setExperience(id, location, isCurrent, position, company, startDate, endDate, context),
		removeExperience: (_, { id }, context) => userResolvers.removeExperience(id, context),
		handleArticle: (_, { article }, context) => companyResolvers.handleArticle(article, context),   
		handleTeam: (_, { team }, context) => companyResolvers.handleTeam(team, context),
    	handleQA: (_, { qa }, context) => companyResolvers.handleQA(qa, context),
		register: (_, {
			nickname,
			email,
			password
		}, context) => authResolvers.createAccount(nickname, email, password, context),
		login: (_, {
			email,
			password
		}, context) => authResolvers.attemptLogin(email, password, context),
		logout: (_, __, context) => authResolvers.attemptLogout(context),
		checkTokens: (_, {
			token,
			refreshToken
		}, context) => authResolvers.checkTokens(token, refreshToken, context),
		forgotPassword: (_, {
			email
		}, context) => authResolvers.forgotPasswordSendCode(email, context),
		checkResetToken: (_, {
			token
		}, context) => authResolvers.forgotPasswordCheckToken(token, context),
		updateForgotPassword: (_, {
			token,
			password
		}, context) => authResolvers.forgotPasswordUpdate(token, password, context),
		activateAccount: (_, {
			token
		}, context) => authResolvers.activateAccount(token, context)
	}
};