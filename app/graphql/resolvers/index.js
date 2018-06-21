const authResolvers = require('./auth');
const userResolvers = require('./user');

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

//TODO: send activation email on registration; forgot password;