module.exports = `
    type Image {
        id: String
        author: User
        isFeatured: Boolean
        sourceId: String
        sourceType: MediaSourceType
        path: String
        originalFilename: String
        filename: String
        title: String
        description: String
        createdAt: Date
        updatedAt: Date
    }
    input ImageInput {
        id: String!
        title: String
        description: String
        isFeatured: Boolean
        source: String
        sourceType: MediaSourceType
        path: String
    }

    extend type Query {
        images: [Image]
    }
`;

`type ImageText {
    title: String
    description: String
}`;