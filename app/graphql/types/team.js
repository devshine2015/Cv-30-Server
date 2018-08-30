module.exports = `
    type Team {
        id: String!
        name: String
        company: Company
        members: [Profile]
        shallowMembers: [ShallowUser]
        officeArticles: [Article]
        jobs: [Job]
        hasProfileCover: Boolean
        coverContentType: ImageType
        coverPath: String
        coverBackground: String
        location: String
    }
    input TeamInput {
        id: String
        companyId: String
        name: String
        hasProfileCover: Boolean
        coverContentType: ImageType
        coverPath: String
        coverBackground: String
        location: String
    }

    extend type Query {
        teams(
			language: LanguageCodeType!
		): [Team]
		team(
			id: String!
			language: LanguageCodeType!
		): Team
    }

    extend type Mutation {
        handleTeam (
			teamDetails: TeamInput!
		): StandardResponse
		handleTeamMember (
			teamId: String!
            memberId: String!
            add: Boolean
		): StandardResponse
    }
`;