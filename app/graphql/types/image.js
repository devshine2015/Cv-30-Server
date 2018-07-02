const Image = `
    union ImageSource = Article | Profile | Company | Job
    type Image {
        id: String
        author: User
        title: String
        description: String
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
        originalFilename: String
        filename: String
        createdAt: Date
        updatedAt: Date
    }
    input ImageInput {
        id: String
        title: String
        description: String
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
    }
`;

module.exports = () => [Image];