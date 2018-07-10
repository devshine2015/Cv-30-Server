const Video = `
    union VideoSource = Article | Profile | Experience | Project
    type Video {
        id: String
        author: User
        i18n: [VideoText]
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
        originalFilename: String
        filename: String
        createdAt: Date
        updatedAt: Date
    }
    type VideoText {
        title: String
        description: String
    }
    input VideoInput {
        id: String!
        title: String
        description: String
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
    }
`;

module.exports = () => [Video];