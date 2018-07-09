const Scalars = require('./scalars');

const Experience = `
    type Experience {
        id: String
        position: String
        company: String
        description: String
        startDate: Date
        location: String
        endDate: Date
        isCurrent: Boolean,
        i18n: [ExperienceText]
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

const ExperienceText = `
    type ExperienceText {
        title: String
        description: String
    }
`;

module.exports = () => [Experience, ExperienceText];