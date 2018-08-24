module.exports = `
    type Industry {
        id: Int
        i18n: [IndustryText]
    }
    type IndustryText {
        title: String
    }

    extend type Query {
        industries(
            language: LanguageCodeType!
        ): [Industry]
    }
`;