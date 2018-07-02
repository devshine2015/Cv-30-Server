module.exports = `
    type Team {
        id: String!
        name: String
        members: [Profile]
        officeLife: [Article]
        jobs: [Job]
        hasProfileCover: Boolean
        profileBackgroundColor: String
    }
    input TeamInput {
        id: String
        name: String
        hasProfileCover: Boolean
        profileBackgroundColor: String
    }
`;