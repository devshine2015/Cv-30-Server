const ShallowUser = `
	type ShallowUser {
    	id: String!
        email: String!
        nickname: String!
        firstName: String
        lastName: String
        position: String!
        updatedAt: Date!
        createdAt: Date!
    }
    input ShallowUserInput {
        id: String
        email: String!
        firstName: String!
        lastName: String!
        position: String!
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

module.exports = () => [ShallowUser];