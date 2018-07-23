const Scalars = require('./scalars');

const User = `
	type User {
    	id: String!
        email: String!
        status: UserStatus!
        nickname: String!
        firstName: String
        lastName: String
        updatedAt: Date!
        createdAt: Date!
    }
    input UserSettingsInput {
        firstName: String!
        lastName: String!
        oldPassword: String
        newPassword: String
    }
    input FollowInput {
        userToFollowId: String
        companyId: String
        jobId: String
        teamId: String
        isFollowing: Boolean!
    }
`;

module.exports = () => [User, Scalars];