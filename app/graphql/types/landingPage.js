module.exports = `
    type LandingPage {
        hasCover: Boolean
        coverContentType: ImageType
        coverPath: String
        coverBackground: String
        hasFooterCover: Boolean
        footerCoverContentType: ImageType
        footerCoverPath: String
        footerCoverBackground: String
        i18n: [LandingPageText]
        created_at: Date
        updated_at: Date
    }
    type LandingPageText {
        headline: String
        footerMessage: String
    }
    input LandingPageInput {
        hasCover: Boolean
        coverContentType: ImageType
        coverPath: String
        coverBackground: String
        hasFooterCover: Boolean
        footerCoverContentType: ImageType
        footerCoverPath: String
        footerCoverBackground: String
        headline: String
        footerMessage: String
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