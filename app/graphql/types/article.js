module.exports = `
    enum PostAs {
        profile
        company
        team
        landingPage
    }
    type Article {
        id: String!
        author: Profile
        title: String
        slug: String
        description: String
        isPost: Boolean
        postAs: PostAs!
        postingCompany: Company
        postingTeam: Team
        featuredImage: Image
        images: [Image]
        videos: [Video]
        tags: [ArticleTag]
        createdAt: Date
        updatedAt: Date
    }
    type ArticleTag {
        id: Int
        title: String
        votes: Int
        canVote: Boolean
    }

    type ArticlesConnection {
        edges: [ArticleEdge]!
        pageInfo: PageInfo!
    }

    type ArticleEdge {
        node: Article!
        cursor: String!
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
            first: Int!
            after: String
        ): ArticlesConnection
        feedArticles(
            language: LanguageCodeType!
            userId: String
            companyId: String
            teamId: String
            first: Int!
            after: String
        ): ArticlesConnection
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
    }
    input ArticleTagsInput {
        titles: [String!]!
        articleId: String!
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
        appreciate(
            tagId: Int!
            articleId: String!
        ): StandardResponse
        removeArticle (
            id: String!
        ): StandardResponse
    }
`;

`type ArticleText {
    title: String
    description: String
}
type ArticleTagText {
    title: String
}`;