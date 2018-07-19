module.exports = `
    type Job {
        id: String!
        name: String
        expireDate: Date
        phone: String
        email: String
        facebook: String
        linkedin: String
        createdAt: Date
        updatedAt: Date
        i18n: [JobText]
        company: Company
        team: Team
        applicants: [Profile]
    }
    type JobText {
        title: String
        description: String
        idealCandidate: String
    }
    input JobInput {
        id: String
        companyId: String
        teamId: String
        title: String
        description: String
        idealCandidate: String
        phone: String
        email: String
        facebook: String
        linkedin: String
        expireDate: Date
    }
`;