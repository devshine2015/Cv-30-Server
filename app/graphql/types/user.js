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

    extend type Query {
        profile(
			id: String
			language: LanguageCodeType!
		): Profile
		profiles(
			language: LanguageCodeType!
		): [Profile]
    }

    extend type Mutation {
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
		handleFollow (
			details: FollowInput!
		): StandardResponse
		setPosition(
			position: String
		): StandardResponse
	}
`;

module.exports = () => [User, Scalars];