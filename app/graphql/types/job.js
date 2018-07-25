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
        location: String
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
        location: String
    }

    extend type Query {
        jobs(
            language: LanguageCodeType!
            companyId: String
		): [Job]
		job(
			id: String!
			language: LanguageCodeType!
		): Job
    }

    extend type Mutation {
        handleJob (
			language: LanguageCodeType!
			jobDetails: JobInput!
		): StandardResponse
        handleApplyToJob (
			jobId: String!
			isApplying: Boolean!
		): StandardResponse
    }
`;