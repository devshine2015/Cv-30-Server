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
        jobTypes: [JobType]
    }
    type JobText {
        title: String
        description: String
        idealCandidate: String
    }
    type JobType {
        id: Int
        i18n: [JobTypeText]
    }
    type JobTypeText {
        title: String
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
        jobTypes: [Int]
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
        jobTypes(
            language: LanguageCodeType!
        ): [JobType]
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