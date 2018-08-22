module.exports = `
    enum PostAs {
        profile
        company
        team
    }
    type Article {
        id: String!
        author: Profile
        isPost: Boolean
        postAs: PostAs!
        postingCompany: Company
        postingTeam: Team
        featuredImage: Image
        images: [Image]
        videos: [Video]
        i18n: [ArticleText]
        tags: [ArticleTag]
        createdAt: Date
        updatedAt: Date
    }
    type ArticleText {
        title: String
        description: String
    }
    type ArticleTag {
        id: String!
        i18n: [ArticleTagText]
        users: [Profile]
    }
    type ArticleTagText {
        title: String
    }
    type NewsFeedArticles {
        following: [Article]
        others: [Article]
    }

    extend type Query {
        articles(
			language: LanguageCodeType!
        ): [Article]
		article(
			id: String!
			language: LanguageCodeType!
        ): Article
        newsFeedArticles(
            language: LanguageCodeType!
            peopleOrCompany: String
            tags: [String]
        ): NewsFeedArticles
        feedArticles(
            language: LanguageCodeType!
            userId: String
            companyId: String
            teamId: String
        ): [Article]
    }

    input ArticleInput {
        id: String
        isFeatured: Boolean
        isAboutMe: Boolean
        isPost: Boolean
        postAs: PostAs
        postingCompanyId: String
        postingTeamId: String
        images: [ImageInput]
        videos: [VideoInput]
        title: String
        description: String
        tags: [String!]
        created_at: Date
        updated_at: Date
    }
    input ArticleOptions {
        articleId: String
        companyId: String
        isFeatured: Boolean
        isAtOffice: Boolean
        isMoreStories: Boolean
        teamId: String
    }

    input ArticleTagInput {
        title: String!
        articleId: String!
        isSet: Boolean
    }
    input ArticleTagsInput {
        titles: [String!]!
        articleId: String!
        isSet: Boolean
    }
    
    extend type Mutation {
        handleArticle (
			language: LanguageCodeType!
			article: ArticleInput
			options: ArticleOptions
        ): StandardResponse
        handleArticleTags (
			language: LanguageCodeType!
			details: ArticleTagsInput!
        ): StandardResponse
        endorseArticle (
            articleId: String!
            isEndorsing: Boolean
        ): StandardResponse
    }
`;