module.exports = `
    type Experience {
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

    input ExperienceInput {
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

`type ExperienceText {
    title: String
    description: String
}`;