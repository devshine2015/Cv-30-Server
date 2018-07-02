const Image = require('./image');
const Video = require('./video');

const Article = `
    type Article {
        id: String!
        author: User
        image: Image
        video: Video
        title: String
        description: String
        created_at: Date
        updated_at: Date
    }
    input ArticleInput {
        id: String
        isFeatured: Boolean
        isAboutMe: Boolean
        author: String
        image: String
        video: String
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
    }
`;

module.exports = () => [Article, Image, Video];