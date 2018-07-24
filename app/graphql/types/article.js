const Image = require('./image');
const Video = require('./video');

const Article = `
    type Article {
        id: String!
        author: User
        featuredImage: Image
        images: [Image]
        videos: [Video]
        i18n: [ArticleText]
        created_at: Date
        updated_at: Date
    }
    type ArticleText {
        title: String
        description: String
    }
    input ArticleInput {
        id: String
        isFeatured: Boolean
        isAboutMe: Boolean
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

    extend type Query {
        articles(
			language: LanguageCodeType!
		): [Article]
		article(
			id: String!
			language: LanguageCodeType!
		): Article
    }
    
    extend type Mutation {
        handleArticle (
			language: LanguageCodeType!
			article: ArticleInput
			options: ArticleOptions
		): StandardResponse
    }
`;

module.exports = () => [Article, Image, Video];