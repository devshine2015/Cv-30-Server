module.exports = `
    type Ad {
        id: String
        image: Image
        url: String
    }
    input AdInput {
        id: String!
        image: ImageInput!
        url: String!
    }
    
    extend type Query {
        ads(
            language: LanguageCodeType!
        ): [Ad]
    }

    extend type Mutation {
        handleAd (
            language: LanguageCodeType!
			details: AdInput!
		): StandardResponse
    }
`;