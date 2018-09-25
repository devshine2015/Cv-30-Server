module.exports = `
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
	type Signature {
		bucket: String!
    	region: String!
		keyStart: String
		params: SignatureParams!
	}
	type SignatureParams {
		acl: String
		policy: String
		x_amz_algorithm: String
		x_amz_credential: String
		x_amz_date: String
		x_amz_signature: String
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

    type Query {
		signature(id: String!): Signature
        profile(
			id: String
			language: LanguageCodeType!
		): Profile
		profiles(
			language: LanguageCodeType!
			first: Int!
			after: String
		): ProfilesConnection
    }

    type Mutation {
		avatar ( status: Boolean, contentType: ImageType, path: String ): StandardResponse
		profileCover ( status: Boolean, contentType: ImageType, path: String ): StandardResponse
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
		setSkills (
			skills: [Int]!
			language: LanguageCodeType!
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
		handleFollow (
			details: FollowInput!
		): StandardResponse
		setPosition(
			position: String
		): StandardResponse
		deleteProfile: StandardResponse
	}
`;