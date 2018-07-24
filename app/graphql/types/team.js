module.exports = `
    type Team {
        id: String!
        name: String
        company: Company
        members: [User]
        officeArticles: [Article]
        jobs: [Job]
        hasProfileCover: Boolean
        coverContentType: ImageType
        coverBackground: String
    }
    input TeamInput {
        id: String
        companyId: String
        name: String
        hasProfileCover: Boolean
        coverContentType: ImageType
        coverBackground: String
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
		addMemberToTeam (
			teamId: String!,
			memberId: String!
		): StandardResponse
		removeMemberFromTeam (
			teamId: String!,
			memberId: String!
		): StandardResponse
    }
`;