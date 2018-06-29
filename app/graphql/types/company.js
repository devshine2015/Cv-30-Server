module.exports = `
    type Company {
        id: String!
        name: String
        createdAt: Date
        updatedAt: Date
        i18n: [CompanyText]
        featuredArticles: [Article]
        officeArticles: [Article]
        storiesArticles: [Article]
        tags: [Tag]
        faqs: [Faq]
    }
    input CompanyInput {
        id: String
        name: String
        headline: String
        description: String
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
    type Faq {
        id: Int
        i18n: [FaqText]
    }
    type FaqText {
        question: String,
		answer: String
    }
`;