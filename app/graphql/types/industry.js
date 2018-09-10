module.exports = `
    type Industry {
        id: Int
        title: String
    }

    extend type Query {
        industries(
            language: LanguageCodeType!
        ): [Industry]
    }
`;

`type IndustryText {
    title: String
}`;