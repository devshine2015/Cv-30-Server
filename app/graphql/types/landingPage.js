module.exports = `
    type LandingPage {
        hasCover: Boolean
        coverContentType: ImageType
        coverBackground: String
        i18n: [LandingPageText]
        created_at: Date
        updated_at: Date
    }
    type LandingPageText {
        headline: String
    }
    input LandingPageInput {
        hasCover: Boolean
        coverContentType: ImageType
        coverBackground: String
        headline: String
    }
    
    extend type Query {
        landingPage(
			language: LanguageCodeType!
		): LandingPage
    }

    extend type Mutation {
        handleLandingPage (
			language: LanguageCodeType!
			details: LandingPageInput!
		): StandardResponse
    }
`;