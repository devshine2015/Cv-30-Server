const Image = require('./image');
const Video = require('./video');

const Article = `
    type Article {
        id: String!
        author: Profile
        isPost: Boolean
        featuredImage: Image
        images: [Image]
        videos: [Video]
        i18n: [ArticleText]
        tags: [ArticleTag]
        endorsers: [Profile]
        createdAt: Date
        updatedAt: Date
    }
    type ArticleText {
        title: String
        description: String
    }
    type ArticleTag {
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
        images: [ImageInput]
        videos: [VideoInput]
        title: String
        description: String
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
    
    extend type Mutation {
        handleArticle (
			language: LanguageCodeType!
			article: ArticleInput
			options: ArticleOptions
        ): StandardResponse
        handleArticleTag (
			language: LanguageCodeType!
			details: ArticleTagInput!
        ): StandardResponse
        endorseArticle (
            articleId: String!
            isEndorsing: Boolean
        ): StandardResponse
    }
`;

module.exports = () => [Article, Image, Video];