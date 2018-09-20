module.exports = `
    type Industry {
        id: Int
        key: String!
    }

    extend type Query {
        industries(
            language: LanguageCodeType!
        ): [Industry]
    }
`;