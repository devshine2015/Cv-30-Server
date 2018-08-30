module.exports = `
	type ShallowUser {
    	id: String!
        email: String!
        nickname: String!
        firstName: String
        lastName: String
        position: String!
        avatarPath: String
        description: String
        updatedAt: Date!
        createdAt: Date!
    }
    input ShallowUserInput {
        id: String
        email: String!
        firstName: String!
        lastName: String!
        position: String!
        avatarPath: String
        description: String
    }
    input ShallowUserOptions {
        shallowUserId: String!
        teamId: String!
        isMember: Boolean
    }

    extend type Mutation {
        handleShallowUser(
            shallowUser: ShallowUserInput
            options: ShallowUserOptions
        ): StandardResponse
	}
`;