const Image = `
    union ImageSource = Article | Profile
    type Image {
        id: Int
        uid: String
        author: User
        title: String
        description: String
        isFeatured: Boolean
        source: ImageSource
        target: ImageTarget
        path: String
        originalFilename: String
        filename: String
        createdAt: Date
        updatedAt: Date
        
    }
`;

module.exports = () => [Image];