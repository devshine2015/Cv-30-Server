module.exports = `
    type Job {
        id: String!
        name: String
        expireDate: Date
        createdAt: Date
        updatedAt: Date
        i18n: [JobText]
        company: Company
    }
    type JobText {
        title: String
        description: String
        idealCandidate: String
    }
    input JobInput {
        id: String
        companyId: String
        title: String
        description: String
        idealCandidate: String
        expireDate: Date
    }
`;