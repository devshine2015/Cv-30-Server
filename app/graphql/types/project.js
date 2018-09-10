module.exports = `
    type Project {
        id: String
        position: String
        company: String
        location: String
        startDate: Date
        endDate: Date
        isCurrent: Boolean,
        title: String
        description: String
        videos: [Video]
        images: [Image]
    }

    input ProjectInput {
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

`type ProjectText {
    title: String
    description: String
}`;