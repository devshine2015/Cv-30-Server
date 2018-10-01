module.exports = `
    type Hobby {
        id: String
        position: String
        company: String
        startDate: Date
        location: String
        endDate: Date
        isCurrent: Boolean,
        title: String
        description: String
        videos: [Video]
        images: [Image]
    }

    input HobbyInput {
        id: String
        location: String
        isCurrent: Boolean
        position: String
        company: String
        startDate: Date
        endDate: Date
        title: String
        description: String
        videos: [VideoInput]
        images: [ImageInput]
    }
`;

`type HobbyText {
    title: String
    description: String
}`;