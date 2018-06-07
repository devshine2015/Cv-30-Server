const authResolvers = require('./auth');

module.exports = {
	Query: {
		// cards: (_, args, context) => cardResolvers.list(args, context),
		// card: (_, args, {user, models}) => {
		// 	if (!user) return {};
		// }
	},
	Mutation: {
		register: (_, {
			nickname,
			email,
			password
		}, context) => authResolvers.createAccount(nickname, email, password, context),
		login: (_, {
			email,
			password
		}, context) => authResolvers.attemptLogin(email, password, context),
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