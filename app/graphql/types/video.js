const Video = `
    union VideoSource = Article | Profile
    type Video {
        id: Int
        uid: String
        author: User
        title: String
        description: String
        isFeatured: Boolean
        source: VideoSource
        target: VideoTarget
        path: String
        originalFilename: String
        filename: String
        createdAt: Date
        updatedAt: Date
        
    }
`;

module.exports = () => [Video];