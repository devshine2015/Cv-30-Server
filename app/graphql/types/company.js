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
        activityField: String
        noOfEmployees: String
        location: String
        tags: [Tag]
        faqs: [Faq]
        jobs: [Job]
        teams: [Team]
    }
    input CompanyInput {
        id: String
        name: String
        headline: String
        description: String
        activityField: String
        noOfEmployees: String
        location: String
        place: PlaceInput
    }
    input PlaceInput {
        addressComponents: String
        formattedAddress: String
        latitude: Float
        longitude: Float
        internationalPhoneNumber: String
        name: String
        placeId: String
        compoundCode: String
        globalCode: String
        rating: Float
        reviews: String
        types: String
        googleUrl: String
        website: String
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
	}
`;