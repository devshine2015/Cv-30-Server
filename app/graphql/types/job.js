module.exports = `
    type Job {
        id: String!
        name: String
        createdAt: Date
        updatedAt: Date
        i18n: [JobText]
        featuredArticles: [Article]
        officeArticles: [Article]
        storiesArticles: [Article]
        tags: [Tag]
        faqs: [Faq]
    }
    type JobText {
        title: String
        description: String
        idealCandidate: String
    }
    input JobInput {
        id: String
        title: String
        description: String
        idealCandidate: String
    }
`;