module.exports = `
    type Company {
        id: String
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
    type CompanyText {
        headline: String
        description: String
    }
    type Tag {
        id
        i18n: [TagText]
    }
    type TagText {
        title: String
    }
    type Faq {
        id
        u18n: [FaqText]
    }
    type FaqText {
        question: String,
		answer: String
    }
`;