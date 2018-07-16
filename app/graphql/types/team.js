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
`;