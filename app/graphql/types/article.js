const Image = require('./image');
const Video = require('./video');

const Article = `
    type Article {
        id: String
        author: User
        image: Image
        video: Video
        title: String
        description: String
        created_at: Date
        updated_at: Date
    }
`;

module.exports = () => [Article, Image, Video];