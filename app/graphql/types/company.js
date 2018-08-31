module.exports = `
    type Company {
        id: String!
        owner: User!
        name: String
        createdAt: Date
        updatedAt: Date
        i18n: [CompanyText]
        featuredArticles: [Article]
        officeArticles: [Article]
        storiesArticles: [Article]
        industry: Industry
        activityField: String
        noOfEmployees: String
        location: String
        tags: [Tag]
        faqs: [Faq]
        jobs: [Job]
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
        industry: String
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
    type CompanyText {
        headline: String
        description: String
    }
    type Tag {
        id: Int
        i18n: [TagText]
    }
    type TagText {
        title: String
    }
    input TagsInput {
        companyId: String!
        tags: [String!]!
    }
    type Faq {
        id: String
        i18n: [FaqText]
    }
    type FaqText {
        question: String,
		answer: String
    }
    input FaqInput {
        id: String
        companyId: String
        question: String
        answer: String
        remove: Boolean
    }
    
    extend type Query {
        companies(
			language: LanguageCodeType!
		): [Company]
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