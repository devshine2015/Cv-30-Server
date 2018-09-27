module.exports = `
    type Company {
        id: String!
        owner: User!
        name: String
        createdAt: Date
        updatedAt: Date
        headline: String
        description: String
        featuredArticles: [Article]
        officeArticles: [Article]
        storiesArticles: [Article]
        industry: Industry
        activityField: String
        noOfEmployees: String
        location: String
        tags: [Tag]
        faqs: [Faq]
        recentJobs: [Job]
        teams: [Team]
        hasLogo: Boolean
        logoContentType: ImageType
        logoPath: String
        hasCover: Boolean
        coverContentType: ImageType
        coverPath: String
        coverBackground: String
    }
    input CompanyInput {
        id: String
        name: String
        headline: String
        description: String
        industryId: Int
        activityField: String
        noOfEmployees: String
        location: String
        hasLogo: Boolean
        logoContentType: ImageType
        logoPath: String
        hasCover: Boolean
        coverContentType: ImageType
        coverPath: String
        coverBackground: String
    }
    type Tag {
        id: Int
        title: String
    }
    input TagsInput {
        companyId: String!
        tags: [String!]!
    }
    type Faq {
        id: String
        question: String
        answer: String
    }
    input FaqInput {
        id: String
        companyId: String
        question: String
        answer: String
        remove: Boolean
    }

    type CompaniesConnection {
        edges: [CompanyEdge]!
        pageInfo: PageInfo!
    }

    type CompanyEdge {
        node: Company!
        cursor: String!
    }
    
    extend type Query {
        companies(
            language: LanguageCodeType!
            first: Int!
            after: String
		): CompaniesConnection
		company(
			id: String!
			language: LanguageCodeType!
        ): Company
    }

    extend type Mutation {
        handleCompany(
			language: LanguageCodeType!
			details: CompanyInput!
        ): StandardResponse
        setTags(
			language: LanguageCodeType!
			tagsInput: TagsInput!
		): StandardResponse
		removeTag (
			id: Int!
			companyId: String!
        ): StandardResponse
        handleFAQ (
			language: LanguageCodeType!
            faq: FaqInput!
		): StandardResponse
    }
`;

`type CompanyText {
    headline: String
    description: String
}
type FaqText {
    question: String,
    answer: String
}
type TagText {
    title: String
}`;